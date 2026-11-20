const db = require('../config/db');

class AsambleaService {
  async getAll() {
    const result = await db.query(
      'SELECT id, tipo, nombre, TO_CHAR(fecha, \'YYYY-MM-DD\') as fecha, hora, lugar FROM asambleas ORDER BY fecha DESC, hora DESC'
    );
    return result.rows;
  }

  async getById(id) {
    const result = await db.query(
      'SELECT id, tipo, nombre, TO_CHAR(fecha, \'YYYY-MM-DD\') as fecha, hora, lugar FROM asambleas WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async create(data) {
    const { tipo, nombre, fecha, hora, lugar } = data;
    const result = await db.query(
      `INSERT INTO asambleas (tipo, nombre, fecha, hora, lugar) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, tipo, nombre, TO_CHAR(fecha, 'YYYY-MM-DD') as fecha, hora, lugar`,
      [tipo, nombre || tipo, fecha, hora, lugar]
    );
    return result.rows[0];
  }

  // MÉTODO AGREGADO PARA EDITAR
  async update(id, data) {
    const { tipo, nombre, fecha, hora, lugar } = data;
    const result = await db.query(
      `UPDATE asambleas 
       SET tipo = $1, nombre = $2, fecha = $3, hora = $4, lugar = $5
       WHERE id = $6
       RETURNING id, tipo, nombre, TO_CHAR(fecha, 'YYYY-MM-DD') as fecha, hora, lugar`,
      [tipo, nombre || tipo, fecha, hora, lugar, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query(
      'DELETE FROM asambleas WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Pre-Quórum y Confirmación de Asistencia
  async confirmarAsistencia(asambleaId, vecinoId) {
    const query = `
      INSERT INTO confirmaciones_asamblea (asamblea_id, vecino_id)
      VALUES ($1, $2)
      ON CONFLICT (asamblea_id, vecino_id) DO UPDATE SET confirmado_en = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await db.query(query, [asambleaId, vecinoId]);
    return result.rows[0];
  }

  async obtenerPreQuorum(asambleaId, vecinoId = null) {
    const countRes = await db.query(
      `SELECT COUNT(*)::int AS confirmados FROM confirmaciones_asamblea WHERE asamblea_id = $1`,
      [asambleaId]
    );
    const totalRes = await db.query(`SELECT COUNT(*)::int AS total FROM vecinos`);
    
    let yaConfirmado = false;
    if (vecinoId) {
      const checkRes = await db.query(
        `SELECT 1 FROM confirmaciones_asamblea WHERE asamblea_id = $1 AND vecino_id = $2`,
        [asambleaId, vecinoId]
      );
      yaConfirmado = checkRes.rows.length > 0;
    }

    const confirmados = countRes.rows[0]?.confirmados || 0;
    const total = totalRes.rows[0]?.total || 1;
    const porcentaje = Math.round((confirmados / total) * 100);

    return {
      asambleaId: Number(asambleaId),
      confirmados,
      totalVecinos: total,
      porcentaje,
      yaConfirmado,
    };
  }
}

module.exports = new AsambleaService();