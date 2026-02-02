import express from 'express';
import Joi from 'joi';
import { query } from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cart - Get user's cart (or guest cart via session)
router.get('/', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ items: [], total: 0 });
    }

    const cartQuery = `
      SELECT 
        ci.id,
        ci.quantity,
        ci.added_at,
        p.id as product_id,
        p.name as product_name,
        p.slug as product_slug,
        p.price,
        p.sku,
        p.inventory_quantity,
        p.track_inventory,
        pi.url as image_url,
        pi.alt_text
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE ci.user_id = $1 AND p.is_active = TRUE
      ORDER BY ci.added_at DESC
    `;

    const result = await query(cartQuery, [req.user.id]);
    
    const items = result.rows;
    const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    res.json({
      items,
      subtotal: parseFloat(total.toFixed(2)),
      tax: 0, // TODO: Calculate tax based on shipping address
      shipping: 0, // TODO: Calculate shipping
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const addItemSchema = Joi.object({
      productId: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).max(10).default(1)
    });

    const { error, value } = addItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { productId, quantity } = value;

    // Check if product exists and is active
    const productResult = await query(
      'SELECT id, name, price, inventory_quantity, track_inventory FROM products WHERE id = $1 AND is_active = TRUE',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    // Check inventory if tracking is enabled
    if (product.track_inventory && product.inventory_quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient inventory',
        available: product.inventory_quantity 
      });
    }

    // Check if item already exists in cart
    const existingItemResult = await query(
      'SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    let cartItem;
    if (existingItemResult.rows.length > 0) {
      // Update existing item
      const existingItem = existingItemResult.rows[0];
      const newQuantity = existingItem.quantity + quantity;

      // Check inventory for new total quantity
      if (product.track_inventory && product.inventory_quantity < newQuantity) {
        return res.status(400).json({ 
          error: 'Insufficient inventory for total quantity',
          available: product.inventory_quantity,
          currentInCart: existingItem.quantity
        });
      }

      const updateResult = await query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
        [newQuantity, existingItem.id]
      );
      cartItem = updateResult.rows[0];
    } else {
      // Add new item
      const insertResult = await query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, productId, quantity]
      );
      cartItem = insertResult.rows[0];
    }

    res.status(201).json({
      message: 'Item added to cart',
      cartItem: {
        id: cartItem.id,
        productId: cartItem.product_id,
        quantity: cartItem.quantity,
        addedAt: cartItem.added_at
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', authenticateToken, async (req, res) => {
  try {
    const updateSchema = Joi.object({
      quantity: Joi.number().integer().min(0).max(10).required()
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { itemId } = req.params;
    const { quantity } = value;

    // If quantity is 0, delete the item
    if (quantity === 0) {
      await query(
        'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
        [itemId, req.user.id]
      );
      return res.json({ message: 'Item removed from cart' });
    }

    // Check if item exists and belongs to user
    const itemResult = await query(
      `SELECT ci.id, ci.product_id, p.inventory_quantity, p.track_inventory
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.id = $1 AND ci.user_id = $2`,
      [itemId, req.user.id]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const item = itemResult.rows[0];

    // Check inventory
    if (item.track_inventory && item.inventory_quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient inventory',
        available: item.inventory_quantity 
      });
    }

    // Update quantity
    const updateResult = await query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, itemId, req.user.id]
    );

    res.json({
      message: 'Cart item updated',
      cartItem: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [itemId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;