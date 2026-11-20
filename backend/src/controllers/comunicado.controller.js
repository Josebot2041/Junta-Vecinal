const comunicadoService = require('../services/comunicado.service');

const comunicadoController = {
  async listar(req, res) {
    try {
      const items = await comunicadoService.getAll();
      return res.status(200).json(items);
    } catch (error) {
      console.error('Error al listar comunicados:', error);
      return res.status(500).json({ error: 'Error interno del servidor al obtener comunicados' });
    }
  },

  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const item = await comunicadoService.getById(id);
      if (!item) return res.status(404).json({ error: 'Comunicado no encontrado' });
      return res.status(200).json(item);
    } catch (error) {
      console.error('Error al obtener comunicado:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async crear(req, res) {
    try {
      const { titulo, descripcion } = req.body;
      if (!titulo || !descripcion) {
        return res.status(400).json({ error: 'Título y descripción son requeridos' });
      }
      const nuevo = await comunicadoService.create(req.body);
      return res.status(201).json({
        message: 'Comunicado publicado exitosamente',
        data: nuevo
      });
    } catch (error) {
      console.error('Error al crear comunicado:', error);
      return res.status(500).json({ error: 'Error interno al registrar comunicado' });
    }
  },

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const actualizado = await comunicadoService.update(id, req.body);
      if (!actualizado) return res.status(404).json({ error: 'Comunicado no encontrado' });
      return res.status(200).json({
        message: 'Comunicado actualizado exitosamente',
        data: actualizado
      });
    } catch (error) {
      console.error('Error al actualizar comunicado:', error);
      return res.status(500).json({ error: 'Error interno al actualizar comunicado' });
    }
  },

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await comunicadoService.delete(id);
      if (!eliminado) return res.status(404).json({ error: 'Comunicado no encontrado' });
      return res.status(200).json({
        message: 'Comunicado eliminado exitosamente',
        data: eliminado
      });
    } catch (error) {
      console.error('Error al eliminar comunicado:', error);
      return res.status(500).json({ error: 'Error interno al eliminar comunicado' });
    }
  }
};

module.exports = comunicadoController;
