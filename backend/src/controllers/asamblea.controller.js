const asambleaService = require('../services/asamblea.service');

const getAsambleas = async (req, res) => {
  try {
    const asambleas = await asambleaService.getAll();
    res.json(asambleas);
  } catch (error) {
    console.error('Error al obtener asambleas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createAsamblea = async (req, res) => {
  try {
    const { tipo, fecha, hora, lugar } = req.body;
    if (!tipo || !fecha || !hora || !lugar) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevaAsamblea = await asambleaService.create(req.body);
    res.status(201).json(nuevaAsamblea);
  } catch (error) {
    console.error('Error al crear asamblea:', error);
    res.status(500).json({ error: 'Error al registrar la asamblea' });
  }
};

// FUNCIÓN AGREGADA PARA EDITAR
const updateAsamblea = async (req, res) => {
  try {
    const id = req.query.id || req.params.id || req.body.id;
    const { tipo, fecha, hora, lugar } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'El ID es requerido para actualizar' });
    }

    if (!tipo || !fecha || !hora || !lugar) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const actualizada = await asambleaService.update(id, req.body);
    if (!actualizada) {
      return res.status(404).json({ error: 'Asamblea no encontrada' });
    }

    res.json(actualizada);
  } catch (error) {
    console.error('Error al actualizar asamblea:', error);
    res.status(500).json({ error: 'Error al actualizar la asamblea' });
  }
};

const deleteAsamblea = async (req, res) => {
  try {
    const id = req.query.id || req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'El ID es requerido' });
    }

    const eliminada = await asambleaService.delete(id);
    if (!eliminada) {
      return res.status(404).json({ error: 'Asamblea no encontrada' });
    }

    res.json({ message: 'Asamblea eliminada correctamente', asamblea: eliminada });
  } catch (error) {
    console.error('Error al eliminar asamblea:', error);
    res.status(500).json({ error: 'Error al eliminar la asamblea' });
  }
};

module.exports = {
  getAsambleas,
  createAsamblea,
  updateAsamblea,
  deleteAsamblea,
};