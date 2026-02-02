import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/dashboard - Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  // TODO: Implement admin dashboard
  res.json({ message: 'Admin dashboard coming soon' });
});

// Product management routes
router.get('/products', async (req, res) => {
  // TODO: Admin product management
  res.json({ message: 'Admin product management coming soon' });
});

router.post('/products', async (req, res) => {
  // TODO: Create product
  res.json({ message: 'Product creation coming soon' });
});

// Order management routes
router.get('/orders', async (req, res) => {
  // TODO: Admin order management
  res.json({ message: 'Admin order management coming soon' });
});

export default router;