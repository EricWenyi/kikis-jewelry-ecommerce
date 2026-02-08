import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from '../config/database-sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupSQLite() {
  try {
    console.log('🚀 Setting up Kiki\'s Jewelry SQLite database...');

    const db = getDatabase();

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema-sqlite.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema in parts (SQLite doesn't support multiple statements in one exec)
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    console.log('📋 Creating tables and indexes...');
    for (const statement of statements) {
      const stmt = statement.trim();
      if (stmt) {
        try {
          db.exec(stmt);
        } catch (error) {
          console.warn(`Warning: ${error.message} - Statement: ${stmt.substring(0, 50)}...`);
        }
      }
    }

    // Read seed file
    const seedPath = path.join(__dirname, '../database/seed-sqlite.sql');
    const seedData = fs.readFileSync(seedPath, 'utf8');

    // Execute seed data
    console.log('🌱 Seeding initial data...');
    const seedStatements = seedData.split(';').filter(stmt => stmt.trim());
    
    for (const statement of seedStatements) {
      const stmt = statement.trim();
      if (stmt) {
        try {
          db.exec(stmt);
        } catch (error) {
          console.warn(`Warning: ${error.message} - Statement: ${stmt.substring(0, 50)}...`);
        }
      }
    }

    console.log('✅ SQLite database setup completed successfully!');
    console.log('');
    console.log('📦 Created:');
    console.log('  - 4 product categories (Golden Hour, Pacific Silver, Rose Bloom, Mixed Metals)');
    console.log('  - 9 sample products with images');
    console.log('  - Admin user: admin@kikisjewelry.com (password: admin123)');
    console.log('  - Sample customer: sarah@example.com (password: password123)');
    console.log('');
    console.log('📁 Database file created at: backend/database/kikis_jewelry.sqlite');
    console.log('🎉 Ready to start the server!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupSQLite();