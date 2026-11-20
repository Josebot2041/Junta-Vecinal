const pool = require('../config/db');

const comunicadoService = {
  async getAll() {
    const query = 'SELECT * FROM comunicados ORDER BY creado_en DESC';
    const { rows } = await pool.query(query);
    return rows;
  },

  async getById(id) {
    const query = 'SELECT * FROM comunicados WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  async create(data) {
    const {
      titulo,
      categoria = 'Informativo',
      descripcion,
      imagen_url = null,
      archivo_nombre = null,
      prioridad = 'Normal',
      fecha_evento = null
    } = data;

    const query = `
      INSERT INTO comunicados (titulo, categoria, descripcion, imagen_url, archivo_nombre, prioridad, fecha_evento)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [titulo, categoria, descripcion, imagen_url, archivo_nombre, prioridad, fecha_evento];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, data) {
    const {
      titulo,
      categoria,
      descripcion,
      imagen_url,
      archivo_nombre,
      prioridad,
      fecha_evento
    } = data;

    const query = `
      UPDATE comunicados
      SET 
        titulo = COALESCE($1, titulo),
        categoria = COALESCE($2, categoria),
        descripcion = COALESCE($3, descripcion),
        imagen_url = COALESCE($4, imagen_url),
        archivo_nombre = COALESCE($5, archivo_nombre),
        prioridad = COALESCE($6, prioridad),
        fecha_evento = COALESCE($7, fecha_evento)
      WHERE id = $8
      RETURNING *;
    `;
    const values = [titulo, categoria, descripcion, imagen_url, archivo_nombre, prioridad, fecha_evento, id];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async delete(id) {
    const query = 'DELETE FROM comunicados WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }
};

module.exports = comunicadoService;
