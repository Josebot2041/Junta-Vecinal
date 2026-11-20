const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, database: 'junta_vecinal_db', user: 'postgres', password: 'edithteamo' });

async function normalize() {
  try {
    // Normalizar estado lowercase en pagos
    const r1 = await pool.query("UPDATE pagos SET estado = 'Pendiente' WHERE LOWER(estado) = 'pendiente' AND estado != 'Pendiente'");
    console.log('Pagos normalizados (Pendiente):', r1.rowCount);

    // Recalcular saldo y estado_cuenta de todos los vecinos
    const vecinos = await pool.query('SELECT id FROM vecinos');
    for (const v of vecinos.rows) {
      const res = await pool.query(
        "SELECT COALESCE(SUM(monto), 0) AS total FROM pagos WHERE vecino_id = $1 AND LOWER(estado) = 'pendiente'",
        [v.id]
      );
      const total = parseFloat(res.rows[0].total);
      const estado = total > 0 ? 'Con saldo pendiente' : 'Al día';
      await pool.query('UPDATE vecinos SET saldo = $1, estado_cuenta = $2 WHERE id = $3', [total, estado, v.id]);
      console.log(`Vecino ${v.id}: saldo=${total} estado_cuenta=${estado}`);
    }
    console.log('Done.');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

normalize();
