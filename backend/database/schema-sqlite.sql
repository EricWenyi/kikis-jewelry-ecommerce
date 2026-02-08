-- Kiki's Jewelry E-commerce Database Schema (SQLite)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  email_verified INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- User addresses
CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  is_default INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  sku TEXT UNIQUE NOT NULL,
  price REAL NOT NULL,
  compare_at_price REAL,
  cost_price REAL,
  weight REAL,
  dimensions_length REAL,
  dimensions_width REAL,
  dimensions_height REAL,
  material TEXT,
  metal_type TEXT,
  gemstone TEXT,
  size TEXT,
  inventory_quantity INTEGER DEFAULT 0,
  track_inventory INTEGER DEFAULT 1,
  allow_backorder INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  care_instructions TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Product categories (many-to-many)
CREATE TABLE IF NOT EXISTS product_categories (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Shopping cart
CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES users(id),
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal REAL NOT NULL,
  tax_amount REAL DEFAULT 0,
  shipping_amount REAL DEFAULT 0,
  discount_amount REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Order shipping address
CREATE TABLE IF NOT EXISTS order_shipping_addresses (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  phone TEXT
);

-- Order billing address
CREATE TABLE IF NOT EXISTS order_billing_addresses (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'US'
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total REAL NOT NULL,
  product_snapshot TEXT -- JSON string for product details
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlist_items (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  added_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, product_id)
);

-- Email subscriptions
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active INTEGER DEFAULT 1,
  subscribed_at TEXT DEFAULT (datetime('now')),
  unsubscribed_at TEXT
);

-- Product reviews
CREATE TABLE IF NOT EXISTS product_reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_approved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Coupons/Discounts
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value REAL NOT NULL,
  minimum_order_amount REAL,
  maximum_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TEXT,
  expires_at TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_category ON product_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);

-- Triggers for updated_at timestamps
CREATE TRIGGER IF NOT EXISTS update_users_updated_at 
  AFTER UPDATE ON users 
  FOR EACH ROW 
  WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_categories_updated_at 
  AFTER UPDATE ON categories 
  FOR EACH ROW 
  WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE categories SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_products_updated_at 
  AFTER UPDATE ON products 
  FOR EACH ROW 
  WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE products SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_orders_updated_at 
  AFTER UPDATE ON orders 
  FOR EACH ROW 
  WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE orders SET updated_at = datetime('now') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_reviews_updated_at 
  AFTER UPDATE ON product_reviews 
  FOR EACH ROW 
  WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE product_reviews SET updated_at = datetime('now') WHERE id = NEW.id;
END;