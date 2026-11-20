const db = require('../config/db');

class AsistenciaService {
  // Obtiene los vecinos y su estado de asistencia registrado para un evento
  async getByAsambleaId(asambleaId) {
    const query = `
      SELECT 
        v.id,
        v.nombre,
        CONCAT('Lote ', v.lote, ' - Manzano ', v.manzano) AS property,
        COALESCE(a.estado, 'absent') AS status
      FROM vecinos v
      LEFT JOIN asistencias a 
        ON v.id = a.vecino_id AND a.asamblea_id = $1
      ORDER BY v.nombre ASC
    `;
    const result = await db.query(query, [asambleaId]);
    return result.rows;
  }

  // Registra o actualiza la asistencia de un vecino (UPSERT)
  async saveAsistencia(asambleaId, vecinoId, estado) {
    const query = `
      INSERT INTO asistencias (asamblea_id, vecino_id, estado)
      VALUES ($1, $2, $3)
      ON CONFLICT (asamblea_id, vecino_id)
      DO UPDATE SET estado = EXCLUDED.estado, registrado_en = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const result = await db.query(query, [asambleaId, vecinoId, estado]);
    return result.rows[0];
  }

  // Genera multas automáticas a los vecinos ausentes sin licencia
  async generateFines(asambleaId, monto = 50.00) {
    // 1. Obtener la asamblea para obtener su nombre/fecha
    const asambleaRes = await db.query('SELECT nombre FROM asambleas WHERE id = $1', [asambleaId]);
    const asambleaNombre = asambleaRes.rows[0]?.nombre || 'Asamblea';

    // 2. Insertar multa en la tabla pagos para cada vecino con estado 'absent' (o sin registro explícito)
    const query = `
      INSERT INTO pagos (vecino_id, concepto, monto, estado)
      SELECT 
        v.id,
        CONCAT('Multa por Inasistencia: ', $2::text),
        $3::numeric,
        'Pendiente'
      FROM vecinos v
      LEFT JOIN asistencias a ON v.id = a.vecino_id AND a.asamblea_id = $1
      WHERE COALESCE(a.estado, 'absent') = 'absent'
      RETURNING *;
    `;
    const result = await db.query(query, [asambleaId, asambleaNombre, monto]);
    return result.rows;
  }

  // ── Justificaciones / Licencias ───────────────────────────────────────────
  async crearJustificacion({ asamblea_id, vecino_id, motivo, descripcion, documento_url }) {
    const query = `
      INSERT INTO justificaciones (asamblea_id, vecino_id, motivo, descripcion, documento_url, estado)
      VALUES ($1, $2, $3, $4, $5, 'Pendiente')
      RETURNING *;
    `;
    const result = await db.query(query, [asamblea_id, vecino_id, motivo, descripcion, documento_url || null]);
    return result.rows[0];
  }

  async listarJustificaciones(asamblea_id = null) {
    let query = `
      SELECT j.*, v.nombre AS vecino_nombre, v.manzano, v.lote,
             a.nombre AS asamblea_nombre, TO_CHAR(a.fecha, 'YYYY-MM-DD') AS asamblea_fecha
      FROM justificaciones j
      JOIN vecinos v ON j.vecino_id = v.id
      JOIN asambleas a ON j.asamblea_id = a.id
    `;
    const params = [];
    if (asamblea_id) {
      query += ` WHERE j.asamblea_id = $1`;
      params.push(asamblea_id);
    }
    query += ` ORDER BY j.creado_en DESC;`;
    const result = await db.query(query, params);
    return result.rows;
  }

  async resolverJustificacion(id, nuevoEstado) {
    const query = `
      UPDATE justificaciones
      SET estado = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await db.query(query, [nuevoEstado, id]);
    const justificacion = result.rows[0];

    if (justificacion) {
      if (nuevoEstado === 'Aprobada') {
        // Marcar en asistencias como 'justified'
        await db.query(`
          INSERT INTO asistencias (asamblea_id, vecino_id, estado)
          VALUES ($1, $2, 'justified')
          ON CONFLICT (asamblea_id, vecino_id)
          DO UPDATE SET estado = 'justified', registrado_en = CURRENT_TIMESTAMP;
        `, [justificacion.asamblea_id, justificacion.vecino_id]);
      } else if (nuevoEstado === 'Rechazada') {
        // Si estaba 'justified', revertir a 'absent'
        await db.query(`
          INSERT INTO asistencias (asamblea_id, vecino_id, estado)
          VALUES ($1, $2, 'absent')
          ON CONFLICT (asamblea_id, vecino_id)
          DO UPDATE SET estado = 'absent', registrado_en = CURRENT_TIMESTAMP;
        `, [justificacion.asamblea_id, justificacion.vecino_id]);
      }
    }

    return justificacion;
  }
}

module.exports = new AsistenciaService();