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
        'pendiente'
      FROM vecinos v
      LEFT JOIN asistencias a ON v.id = a.vecino_id AND a.asamblea_id = $1
      WHERE COALESCE(a.estado, 'absent') = 'absent'
      RETURNING *;
    `;
    const result = await db.query(query, [asambleaId, asambleaNombre, monto]);
    return result.rows;
  }
}

module.exports = new AsistenciaService();