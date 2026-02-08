-- Seed data for Kiki's Jewelry (SQLite)

-- Insert categories
INSERT OR IGNORE INTO categories (id, name, slug, description, image_url, sort_order) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Golden Hour', 'golden-hour', 'Delicate gold pieces that catch the California sun', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Pacific Silver', 'pacific-silver', 'Sterling silver inspired by ocean waves', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop', 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Rose Bloom', 'rose-bloom', 'Rose gold warmth for everyday elegance', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop', 3),
  ('550e8400-e29b-41d4-a716-446655440004', 'Mixed Metals', 'mixed-metals', 'Bold combinations for the modern minimalist', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop', 4);

-- Insert products
INSERT OR IGNORE INTO products (
  id, name, slug, description, short_description, sku, price, compare_at_price, 
  material, metal_type, size, inventory_quantity, is_active, is_featured
) VALUES
  -- Golden Hour Collection
  ('550e8400-e29b-41d4-a716-446655440011', 'Crescent Moon Necklace', 'crescent-moon-necklace', 
   'Our bestselling Crescent Moon Necklace—a delicate 14k gold-filled pendant on a whisper-thin chain. The perfect everyday piece that transitions from coffee runs to cocktail hours. Handcrafted in our San Francisco studio with ethically sourced materials.',
   'A delicate 14k gold-filled pendant on a whisper-thin chain', 
   'GMN-001', 68.00, NULL, '14k Gold Filled', '14k Gold Filled', 'One Size', 25, 1, 1),
   
  ('550e8400-e29b-41d4-a716-446655440012', 'Sunburst Stud Earrings', 'sunburst-stud-earrings',
   'Capture the golden California sun with these delicate stud earrings. Each piece features intricate rays emanating from a central point, creating a subtle yet striking effect.',
   'Delicate sunburst studs in 14k gold filled',
   'GSE-002', 48.00, NULL, '14k Gold Filled', '14k Gold Filled', 'One Size', 20, 1, 0),
   
  ('550e8400-e29b-41d4-a716-446655440013', 'Infinity Chain Bracelet', 'infinity-chain-bracelet',
   'A timeless piece featuring our signature infinity chain link. Delicate enough for everyday wear, yet elegant enough for special occasions.',
   'Delicate infinity chain link bracelet',
   'GCB-003', 58.00, 72.00, '14k Gold Filled', '14k Gold Filled', 'Adjustable', 15, 1, 0),

  -- Pacific Silver Collection  
  ('550e8400-e29b-41d4-a716-446655440021', 'Ocean Wave Ring', 'ocean-wave-ring',
   'Inspired by the rolling waves of the Pacific Ocean. This sterling silver ring features an organic wave pattern that catches light beautifully.',
   'Sterling silver ring with ocean wave pattern',
   'SWR-004', 42.00, NULL, 'Sterling Silver', 'Sterling Silver', 'Size 6-8', 18, 1, 0),
   
  ('550e8400-e29b-41d4-a716-446655440022', 'Tide Pool Pendant', 'tide-pool-pendant',
   'A sculptural pendant reminiscent of California tide pools. Each piece is unique, reflecting the natural variations found in nature.',
   'Sculptural sterling silver pendant',
   'STP-005', 36.00, NULL, 'Sterling Silver', 'Sterling Silver', 'One Size', 22, 1, 0),

  -- Rose Bloom Collection
  ('550e8400-e29b-41d4-a716-446655440031', 'Rose Petal Hoops', 'rose-petal-hoops',
   'Delicate hoop earrings in rose gold that mimic the soft curves of flower petals. Perfect for adding a touch of romance to any outfit.',
   'Rose gold hoop earrings with petal design',
   'RPH-006', 52.00, NULL, '14k Rose Gold Filled', 'Rose Gold', 'One Size', 16, 1, 0),
   
  ('550e8400-e29b-41d4-a716-446655440032', 'Bloom Stackable Rings', 'bloom-stackable-rings',
   'A set of three delicate stackable rings in rose gold. Wear them together or separately for versatile styling options.',
   'Set of three stackable rose gold rings',
   'BSR-007', 78.00, 95.00, '14k Rose Gold Filled', 'Rose Gold', 'Size 5-9', 12, 1, 1),

  -- Mixed Metals Collection
  ('550e8400-e29b-41d4-a716-446655440041', 'Harmony Necklace', 'harmony-necklace',
   'A bold statement piece featuring interlocking gold and silver elements. Represents the harmony found in contrasts.',
   'Mixed metal necklace with interlocking elements',
   'HMN-008', 88.00, NULL, 'Mixed Metals', 'Gold & Silver', 'Adjustable', 10, 1, 1),
   
  ('550e8400-e29b-41d4-a716-446655440042', 'Duality Cuff', 'duality-cuff',
   'An open cuff bracelet featuring two-tone metal work. The perfect piece for those who appreciate modern minimalism.',
   'Two-tone open cuff bracelet',
   'DCF-009', 64.00, NULL, 'Mixed Metals', 'Gold & Silver', 'Adjustable', 14, 1, 0);

-- Link products to categories
INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES
  -- Golden Hour
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001'),
  
  -- Pacific Silver
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002'),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002'),
  
  -- Rose Bloom
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440003'),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440003'),
  
  -- Mixed Metals
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440004'),
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440004');

-- Insert product images
INSERT OR IGNORE INTO product_images (id, product_id, url, alt_text, sort_order, is_primary) VALUES
  -- Crescent Moon Necklace
  ('img-001-1', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop', 'Crescent Moon Necklace - Front View', 1, 1),
  ('img-001-2', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop', 'Crescent Moon Necklace - Detail', 2, 0),
  
  -- Sunburst Studs
  ('img-002-1', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop', 'Sunburst Stud Earrings', 1, 1),
  
  -- Infinity Bracelet
  ('img-003-1', '550e8400-e29b-41d4-a716-446655440013', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop', 'Infinity Chain Bracelet', 1, 1),
  
  -- Ocean Wave Ring
  ('img-004-1', '550e8400-e29b-41d4-a716-446655440021', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop', 'Ocean Wave Ring', 1, 1),
  
  -- Tide Pool Pendant
  ('img-005-1', '550e8400-e29b-41d4-a716-446655440022', 'https://images.unsplash.com/photo-1594736797933-d0f06ba42cbd?w=800&h=800&fit=crop', 'Tide Pool Pendant', 1, 1),
  
  -- Rose Petal Hoops
  ('img-006-1', '550e8400-e29b-41d4-a716-446655440031', 'https://images.unsplash.com/photo-1596944946061-4f1a46b54915?w=800&h=800&fit=crop', 'Rose Petal Hoops', 1, 1),
  
  -- Bloom Stackable Rings
  ('img-007-1', '550e8400-e29b-41d4-a716-446655440032', 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=800&fit=crop', 'Bloom Stackable Rings Set', 1, 1),
  
  -- Harmony Necklace
  ('img-008-1', '550e8400-e29b-41d4-a716-446655440041', 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop', 'Harmony Mixed Metal Necklace', 1, 1),
  
  -- Duality Cuff
  ('img-009-1', '550e8400-e29b-41d4-a716-446655440042', 'https://images.unsplash.com/photo-1603561596112-db532d74b625?w=800&h=800&fit=crop', 'Duality Two-Tone Cuff', 1, 1);

-- Create admin user (password: admin123 - hashed with bcryptjs)
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, role, email_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440100', 'admin@kikisjewelry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Kiki', 'Admin', 'admin', 1);

-- Sample customer (password: password123 - hashed with bcryptjs)
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, email_verified) VALUES
  ('550e8400-e29b-41d4-a716-446655440101', 'sarah@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Johnson', '(415) 555-0123', 1);

-- Sample address
INSERT OR IGNORE INTO addresses (id, user_id, type, first_name, last_name, address_line_1, city, state, postal_code, is_default) VALUES
  ('addr-001', '550e8400-e29b-41d4-a716-446655440101', 'shipping', 'Sarah', 'Johnson', '123 Valencia St', 'San Francisco', 'CA', '94110', 1);