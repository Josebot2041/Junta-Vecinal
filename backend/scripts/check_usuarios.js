const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, database: 'junta_vecinal_db', user: 'postgres', password: 'edithteamo' });

async function check() {
  const uCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'usuarios'");
  console.log('USUARIOS COLUMNS:', uCols.rows);
  const uRows = await pool.query("SELECT * FROM usuarios");
  console.log('USUARIOS ROWS:', uRows.rows);
  await pool.end();
}
check();
