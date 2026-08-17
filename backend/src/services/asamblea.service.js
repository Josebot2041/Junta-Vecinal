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
}

module.exports = new AsambleaService();