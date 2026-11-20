const pool = require('../config/db');
const { syncSaldoEstado } = require('./vecino.service');

// ── Registrar nuevo pago ──────────────────────────────────────────────────────
const crear = async (data) => {
  const { vecino_id, concepto, monto, estado, fecha } = data;
  const query = `
    INSERT INTO pagos (vecino_id, concepto, monto, estado, fecha) 
    VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_TIMESTAMP)) 
    RETURNING *;
  `;
  const values = [vecino_id, concepto, monto, estado, fecha];
  const result = await pool.query(query, values);
  // Sincronizar saldo/estado_cuenta del vecino
  await syncSaldoEstado(vecino_id);
  return result.rows[0];
};

// ── Listar todos los pagos ────────────────────────────────────────────────────
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

// ── Marcar pago pendiente como cobrado (PATCH) ───────────────────────────────
const cobrarPago = async (id) => {
  const result = await pool.query(
    `UPDATE pagos SET estado = 'Pagado', fecha = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING *`,
    [id]
  );
  const pago = result.rows[0];
  if (pago) await syncSaldoEstado(pago.vecino_id);
  return pago || null;
};

// ── Eliminar / anular pago ────────────────────────────────────────────────────
const eliminarPago = async (id) => {
  const result = await pool.query(
    'DELETE FROM pagos WHERE id = $1 RETURNING *',
    [id]
  );
  const pago = result.rows[0];
  if (pago) await syncSaldoEstado(pago.vecino_id);
  return pago || null;
};

module.exports = {
  crear,
  obtenerTodos,
  cobrarPago,
  eliminarPago,
};
