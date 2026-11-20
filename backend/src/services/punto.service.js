const db = require('../config/db');

class PuntoService {
  async getAll() {
    const result = await db.query(
      `SELECT id, nombre, categoria, latitud, longitud, descripcion, horarios, icono 
       FROM puntos_comunitarios 
       ORDER BY id ASC`
    );
    return result.rows;
  }

  async create(data) {
    const { nombre, categoria, latitud, longitud, descripcion, horarios, icono } = data;
    const result = await db.query(
      `INSERT INTO puntos_comunitarios (nombre, categoria, latitud, longitud, descripcion, horarios, icono)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nombre, categoria, latitud, longitud, descripcion, horarios, icono]
    );
    return result.rows[0];
  }
}

module.exports = new PuntoService();
