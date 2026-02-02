import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      featured, 
      sort = 'created_at',
      order = 'DESC',
      search 
    } = req.query;

    const offset = (page - 1) * limit;
    
    let whereConditions = ['p.is_active = TRUE'];
    let params = [];
    let paramIndex = 1;

    // Category filter
    if (category) {
      whereConditions.push(`c.slug = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    // Featured filter
    if (featured === 'true') {
      whereConditions.push('p.is_featured = TRUE');
    }

    // Search filter
    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');

    // Valid sort fields
    const validSorts = ['name', 'price', 'created_at', 'updated_at'];
    const validOrders = ['ASC', 'DESC'];
    const sortField = validSorts.includes(sort) ? `p.${sort}` : 'p.created_at';
    const orderDir = validOrders.includes(order) ? order : 'DESC';

    // Main query
    const productQuery = `
      SELECT DISTINCT
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
        pi.alt_text,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE ${whereClause}
      ORDER BY ${sortField} ${orderDir}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);

    // Count query
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      query(productQuery, params),
      query(countQuery, params.slice(0, -2)) // Remove limit and offset for count
    ]);

    const totalProducts = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
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
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug - Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Get product details
    const productQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.short_description,
        p.sku,
        p.price,
        p.compare_at_price,
        p.weight,
        p.dimensions_length,
        p.dimensions_width,
        p.dimensions_height,
        p.material,
        p.metal_type,
        p.gemstone,
        p.size,
        p.inventory_quantity,
        p.track_inventory,
        p.allow_backorder,
        p.is_featured,
        p.care_instructions,
        p.created_at,
        p.updated_at
      FROM products p
      WHERE p.slug = $1 AND p.is_active = TRUE
    `;

    const productResult = await query(productQuery, [slug]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Get product images
    const imagesQuery = `
      SELECT url, alt_text, sort_order, is_primary
      FROM product_images
      WHERE product_id = $1
      ORDER BY sort_order ASC, is_primary DESC
    `;
    
    const imagesResult = await query(imagesQuery, [product.id]);

    // Get product categories
    const categoriesQuery = `
      SELECT c.id, c.name, c.slug
      FROM categories c
      JOIN product_categories pc ON c.id = pc.category_id
      WHERE pc.product_id = $1
    `;
    
    const categoriesResult = await query(categoriesQuery, [product.id]);

    // Get related products (same categories, exclude current product)
    const relatedQuery = `
      SELECT DISTINCT
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.price,
        p.compare_at_price,
        pi.url as primary_image,
        pi.alt_text
      FROM products p
      JOIN product_categories pc ON p.id = pc.product_id
      JOIN product_categories pc2 ON pc.category_id = pc2.category_id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE pc2.product_id = $1 
        AND p.id != $1
        AND p.is_active = TRUE
      ORDER BY p.created_at DESC
      LIMIT 4
    `;
    
    const relatedResult = await query(relatedQuery, [product.id]);

    res.json({
      ...product,
      images: imagesResult.rows,
      categories: categoriesResult.rows,
      related_products: relatedResult.rows
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const featuredQuery = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.short_description,
        p.price,
        p.compare_at_price,
        p.material,
        p.metal_type,
        pi.url as primary_image,
        pi.alt_text,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE p.is_featured = TRUE AND p.is_active = TRUE
      ORDER BY p.updated_at DESC
      LIMIT $1
    `;

    const result = await query(featuredQuery, [limit]);

    res.json({
      featured_products: result.rows
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

export default router;