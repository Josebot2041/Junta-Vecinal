const pool = require('../config/db'); // Ajusta según tu configuración de conexión a postgres

const crear = async (data) => {
  const { vecino_id, concepto, monto, estado, fecha } = data;
  const query = `
    INSERT INTO pagos (vecino_id, concepto, monto, estado, fecha) 
    VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP)) 
    RETURNING *;
  `;
  const values = [vecino_id, concepto, monto, estado, fecha];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const obtenerTodos = async () => {
  const query = `
    SELECT p.*, v.nombre AS vecino_nombre, v.manzano, v.lote 
    FROM pagos p
    JOIN vecinos v ON p.vecino_id = v.id
    ORDER BY p.id DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  crear,
  obtenerTodos
};