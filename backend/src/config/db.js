const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'junta_vecinal',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Connection pool settings
  max: 20,                   // Max number of clients in the pool
  idleTimeoutMillis: 30000,  // Close idle clients after 30s
  connectionTimeoutMillis: 5000, // Return error after 5s if connection not established
});

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

/**
 * Helper to execute queries.
 * Usage:
 *   const { rows } = await query('SELECT * FROM users WHERE id = $1', [userId]);
 */
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
