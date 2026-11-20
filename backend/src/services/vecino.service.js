const pool = require('../config/db');

// ─── Función auxiliar: Recalcula saldo y estado_cuenta del vecino ───────────
const syncSaldoEstado = async (vecinoId) => {
  const result = await pool.query(
    `SELECT COALESCE(SUM(monto), 0) AS total_pendiente
     FROM pagos
     WHERE vecino_id = $1 AND LOWER(estado) = 'pendiente'`,
    [vecinoId]
  );
  const totalPendiente = parseFloat(result.rows[0].total_pendiente);
  const estadoCuenta = totalPendiente > 0 ? 'Con saldo pendiente' : 'Al día';
  await pool.query(
    `UPDATE vecinos SET saldo = $1, estado_cuenta = $2 WHERE id = $3`,
    [totalPendiente, estadoCuenta, vecinoId]
  );
};

const vecinoService = {
  // ── Listar todos ─────────────────────────────────────────────────────────
  async getAllVecinos() {
    const query = 'SELECT * FROM vecinos ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows;
  },

  // ── Crear vecino ─────────────────────────────────────────────────────────
  async createVecino(data) {
    const { nombre, ci, telefono, manzano, lote, direccion } = data;
    const query = `
      INSERT INTO vecinos (nombre, ci, telefono, manzano, lote, direccion, estado_cuenta, saldo)
      VALUES ($1, $2, $3, $4, $5, $6, 'Al día', 0.00)
      RETURNING *;
    `;
    const values = [nombre, ci, telefono, manzano, lote, direccion];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ── Actualizar vecino (PUT) ───────────────────────────────────────────────
  async updateVecino(id, data) {
    const { nombre, ci, telefono, manzano, lote, direccion } = data;
    const query = `
      UPDATE vecinos
      SET nombre = $1, ci = $2, telefono = $3, manzano = $4, lote = $5, direccion = $6
      WHERE id = $7
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [nombre, ci, telefono, manzano, lote, direccion, id]);
    return rows[0] || null;
  },

  // ── Eliminar vecino (DELETE) ──────────────────────────────────────────────
  async deleteVecino(id) {
    // Eliminar registros dependientes primero para mantener integridad referencial
    await pool.query('DELETE FROM asistencias WHERE vecino_id = $1', [id]);
    await pool.query('DELETE FROM pagos WHERE vecino_id = $1', [id]);
    const { rows } = await pool.query('DELETE FROM vecinos WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  },

  // ── Historial del vecino (pagos + asistencias) ───────────────────────────
  async getHistorialVecino(id) {
    const vecinoRes = await pool.query('SELECT * FROM vecinos WHERE id = $1', [id]);
    if (!vecinoRes.rows[0]) return null;

    const pagosRes = await pool.query(
      `SELECT * FROM pagos WHERE vecino_id = $1 ORDER BY fecha DESC`,
      [id]
    );
    const asistenciasRes = await pool.query(
      `SELECT a.*, asm.nombre AS asamblea_nombre, asm.fecha AS asamblea_fecha
       FROM asistencias a
       JOIN asambleas asm ON a.asamblea_id = asm.id
       WHERE a.vecino_id = $1
       ORDER BY asm.fecha DESC`,
      [id]
    );

    return {
      vecino: vecinoRes.rows[0],
      pagos: pagosRes.rows,
      asistencias: asistenciasRes.rows,
    };
  },

  // ── Exportar helper para uso en pago.service ──────────────────────────────
  syncSaldoEstado,
};

module.exports = vecinoService;
