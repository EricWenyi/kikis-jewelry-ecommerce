import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database path
const dbPath = path.join(__dirname, '..', 'database', 'kikis_jewelry.sqlite');

// Create database connection
let db;
try {
  db = new Database(dbPath, { verbose: console.log });
  console.log('🔗 Connected to SQLite database:', dbPath);
} catch (error) {
  console.error('💥 SQLite connection error:', error);
  process.exit(1);
}

// Enable foreign keys and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Query wrapper function to maintain compatibility with PostgreSQL code
export const query = async (sql, params = []) => {
  const start = Date.now();
  try {
    // Convert PostgreSQL-style parameters ($1, $2) to SQLite-style (?, ?)
    const sqliteSQL = sql.replace(/\$(\d+)/g, '?');
    
    // Determine if it's a SELECT query
    const isSelect = sqliteSQL.trim().toLowerCase().startsWith('select');
    const isInsertWithReturning = sqliteSQL.toLowerCase().includes('returning');
    
    let result;
    
    if (isSelect) {
      // SELECT query - return all rows
      const stmt = db.prepare(sqliteSQL);
      const rows = stmt.all(params);
      result = { rows, rowCount: rows.length };
    } else if (isInsertWithReturning) {
      // INSERT/UPDATE with RETURNING - need special handling
      // Split the query to remove RETURNING clause and get the data separately
      const sqlWithoutReturning = sqliteSQL.replace(/\s+returning\s+.*$/i, '');
      const stmt = db.prepare(sqlWithoutReturning);
      const info = stmt.run(params);
      
      // For INSERT with RETURNING, get the inserted row
      if (sqliteSQL.toLowerCase().includes('insert into')) {
        const tableName = sqliteSQL.match(/insert\s+into\s+(\w+)/i)[1];
        const selectStmt = db.prepare(`SELECT * FROM ${tableName} WHERE rowid = ?`);
        const rows = [selectStmt.get(info.lastInsertRowid)];
        result = { rows, rowCount: info.changes };
      } else {
        // For UPDATE with RETURNING, this is more complex
        result = { rows: [], rowCount: info.changes };
      }
    } else {
      // INSERT, UPDATE, DELETE without RETURNING
      const stmt = db.prepare(sqliteSQL);
      const info = stmt.run(params);
      result = { rows: [], rowCount: info.changes };
    }
    
    const duration = Date.now() - start;
    console.log('📊 Query executed:', { 
      sql: sqliteSQL.substring(0, 100) + (sqliteSQL.length > 100 ? '...' : ''),
      duration, 
      rows: result.rowCount 
    });
    
    return result;
  } catch (error) {
    console.error('❌ Database query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
};

// Transaction support
export const transaction = (fn) => {
  const txn = db.transaction(fn);
  return txn;
};

// Get database instance for advanced operations
export const getDatabase = () => db;

// Close database connection gracefully
process.on('SIGINT', () => {
  db.close();
  console.log('🔌 SQLite database connection closed.');
  process.exit(0);
});

export default db;