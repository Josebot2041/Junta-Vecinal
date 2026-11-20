const vecinoService = require('../services/vecino.service');

const vecinoController = {
  // GET /api/vecinos
  async getVecinos(req, res) {
    try {
      const vecinos = await vecinoService.getAllVecinos();
      return res.status(200).json(vecinos);
    } catch (error) {
      console.error('Error al obtener vecinos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // POST /api/vecinos
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
  },

  // PUT /api/vecinos/:id
  async updateVecino(req, res) {
    try {
      const { id } = req.params;
      const vecinoActualizado = await vecinoService.updateVecino(id, req.body);
      if (!vecinoActualizado) {
        return res.status(404).json({ error: 'Vecino no encontrado' });
      }
      return res.status(200).json({
        message: 'Vecino actualizado exitosamente',
        vecino: vecinoActualizado
      });
    } catch (error) {
      console.error('Error al actualizar vecino:', error);
      return res.status(500).json({ error: 'Error interno al actualizar el vecino' });
    }
  },

  // DELETE /api/vecinos/:id
  async deleteVecino(req, res) {
    try {
      const { id } = req.params;
      const vecinoEliminado = await vecinoService.deleteVecino(id);
      if (!vecinoEliminado) {
        return res.status(404).json({ error: 'Vecino no encontrado' });
      }
      return res.status(200).json({
        message: 'Vecino eliminado exitosamente',
        vecino: vecinoEliminado
      });
    } catch (error) {
      console.error('Error al eliminar vecino:', error);
      return res.status(500).json({ error: 'Error interno al eliminar el vecino' });
    }
  },

  // GET /api/vecinos/:id/historial
  async getHistorial(req, res) {
    try {
      const { id } = req.params;
      const historial = await vecinoService.getHistorialVecino(id);
      if (!historial) {
        return res.status(404).json({ error: 'Vecino no encontrado' });
      }
      return res.status(200).json(historial);
    } catch (error) {
      console.error('Error al obtener historial del vecino:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = vecinoController;
