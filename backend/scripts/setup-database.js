import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Kiki\'s Jewelry database...');

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    console.log('📋 Creating tables and indexes...');
    await query(schema);

    // Read seed file
    const seedPath = path.join(__dirname, '../database/seed.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');

    // Execute seed data
    console.log('🌱 Seeding initial data...');
    await query(seedData);

    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('📦 Created:');
    console.log('  - 4 product categories (Golden Hour, Pacific Silver, Rose Bloom, Mixed Metals)');
    console.log('  - 9 sample products with images');
    console.log('  - Admin user: admin@kikisjewelry.com (password: admin123)');
    console.log('  - Sample customer: sarah@example.com (password: password123)');
    console.log('');
    console.log('🎉 Ready to start the server!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();