import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categoriesQuery = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.image_url,
        c.sort_order,
        COUNT(pc.product_id) as product_count
      FROM categories c
      LEFT JOIN product_categories pc ON c.id = pc.category_id
      LEFT JOIN products p ON pc.product_id = p.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id, c.name, c.slug, c.description, c.image_url, c.sort_order
      ORDER BY c.sort_order ASC, c.name ASC
    `;

    const result = await query(categoriesQuery);

    res.json({
      categories: result.rows
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug - Get category by slug with products
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12, sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Get category details
    const categoryQuery = `
      SELECT 
        id,
        name,
        slug,
        description,
        image_url
      FROM categories
      WHERE slug = $1 AND is_active = TRUE
    `;

    const categoryResult = await query(categoryQuery, [slug]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = categoryResult.rows[0];

    // Valid sort fields
    const validSorts = ['name', 'price', 'created_at', 'updated_at'];
    const validOrders = ['ASC', 'DESC'];
    const sortField = validSorts.includes(sort) ? `p.${sort}` : 'p.created_at';
    const orderDir = validOrders.includes(order) ? order : 'DESC';

    // Get products in this category
    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.price,
        p.compare_at_price,
        p.material,
        p.metal_type,
        p.is_featured,
        p.inventory_quantity,
        pi.url as primary_image,
        pi.alt_text
      FROM products p
      JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE pc.category_id = $1 AND p.is_active = TRUE
      ORDER BY ${sortField} ${orderDir}
      LIMIT $2 OFFSET $3
    `;

    // Count total products in category
    const countQuery = `
      SELECT COUNT(p.id) as total
      FROM products p
      JOIN product_categories pc ON p.id = pc.product_id
      WHERE pc.category_id = $1 AND p.is_active = TRUE
    `;

    const [productsResult, countResult] = await Promise.all([
      query(productsQuery, [category.id, limit, offset]),
      query(countQuery, [category.id])
    ]);

    const totalProducts = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      category,
      products: productsResult.rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_products: totalProducts,
        per_page: parseInt(limit),
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;