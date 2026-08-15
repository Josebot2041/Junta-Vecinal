const vecinoService = require('../services/vecino.service');

const vecinoController = {
  async getVecinos(req, res) {
    try {
      const vecinos = await vecinoService.getAllVecinos();
      return res.status(200).json(vecinos);
    } catch (error) {
      console.error('Error al obtener vecinos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async createVecino(req, res) {
    try {
      const nuevoVecino = await vecinoService.createVecino(req.body);
      return res.status(201).json({
        message: 'Vecino registrado exitosamente',
        vecino: nuevoVecino
      });
    } catch (error) {
      console.error('Error al registrar vecino:', error);
      return res.status(500).json({ error: 'Error al registrar el vecino (verifique si el CI ya existe)' });
    }
  }
};

module.exports = vecinoController;