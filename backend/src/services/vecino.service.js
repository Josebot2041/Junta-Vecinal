const pool = require('../config/db');

const vecinoService = {
  async getAllVecinos() {
    const query = 'SELECT * FROM vecinos ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows;
  },

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
  }
};

module.exports = vecinoService;