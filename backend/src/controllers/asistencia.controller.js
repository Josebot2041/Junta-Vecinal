const asistenciaService = require('../services/asistencia.service');

const getAsistenciasByAsamblea = async (req, res) => {
  try {
    const { asambleaId } = req.params;
    if (!asambleaId) {
      return res.status(400).json({ error: 'El ID de la asamblea es requerido' });
    }

    const lista = await asistenciaService.getByAsambleaId(asambleaId);
    res.json(lista);
  } catch (error) {
    console.error('Error al obtener asistencias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const registerAsistencia = async (req, res) => {
  try {
    const { eventId, neighborId, status } = req.body;

    if (!eventId || !neighborId || !status) {
      return res.status(400).json({ error: 'eventId, neighborId y status son requeridos' });
    }

    const asistencia = await asistenciaService.saveAsistencia(eventId, neighborId, status);
    res.json({ message: 'Asistencia registrada correctamente', asistencia });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ error: 'Error al registrar la asistencia' });
  }
};

const generateFines = async (req, res) => {
  try {
    const { eventId, monto } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'El ID del evento es requerido' });
    }

    const multasGeneradas = await asistenciaService.generateFines(eventId, monto || 50.00);
    res.json({
      message: `Se generaron ${multasGeneradas.length} multas con éxito.`,
      multas: multasGeneradas,
    });
  } catch (error) {
    console.error('Error al generar multas:', error);
    res.status(500).json({ error: 'Error al generar las multas automáticas' });
  }
};

module.exports = {
  getAsistenciasByAsamblea,
  registerAsistencia,
  generateFines,
};