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

const confirmarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { vecino_id } = req.body;
    if (!id || !vecino_id) {
      return res.status(400).json({ error: 'asamblea_id y vecino_id son requeridos' });
    }
    const confirmacion = await asambleaService.confirmarAsistencia(id, vecino_id);
    const preQuorum = await asambleaService.obtenerPreQuorum(id, vecino_id);
    res.json({ message: 'Asistencia confirmada exitosamente', confirmacion, preQuorum });
  } catch (error) {
    console.error('Error al confirmar asistencia:', error);
    res.status(500).json({ error: 'Error al confirmar asistencia a la asamblea' });
  }
};

const getPreQuorum = async (req, res) => {
  try {
    const { id } = req.params;
    const { vecino_id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'El ID de la asamblea es requerido' });
    }
    const preQuorum = await asambleaService.obtenerPreQuorum(id, vecino_id);
    res.json(preQuorum);
  } catch (error) {
    console.error('Error al obtener pre-quórum:', error);
    res.status(500).json({ error: 'Error al calcular pre-quórum' });
  }
};

module.exports = {
  getAsambleas,
  createAsamblea,
  updateAsamblea,
  deleteAsamblea,
  confirmarAsistencia,
  getPreQuorum,
};