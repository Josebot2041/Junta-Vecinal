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

const solicitarJustificacion = async (req, res) => {
  try {
    const { asamblea_id, vecino_id, motivo, descripcion, documento_url } = req.body;
    if (!asamblea_id || !vecino_id || !motivo) {
      return res.status(400).json({ error: 'asamblea_id, vecino_id y motivo son requeridos' });
    }
    const nueva = await asistenciaService.crearJustificacion({
      asamblea_id,
      vecino_id,
      motivo,
      descripcion,
      documento_url
    });
    res.status(201).json({ message: 'Justificación enviada correctamente', data: nueva });
  } catch (error) {
    console.error('Error al solicitar justificación:', error);
    res.status(500).json({ error: 'Error al registrar la solicitud de justificación' });
  }
};

const listarJustificaciones = async (req, res) => {
  try {
    const { asamblea_id } = req.query;
    const lista = await asistenciaService.listarJustificaciones(asamblea_id || null);
    res.json(lista);
  } catch (error) {
    console.error('Error al listar justificaciones:', error);
    res.status(500).json({ error: 'Error al listar las justificaciones' });
  }
};

const resolverJustificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'Aprobada' | 'Rechazada'
    if (!['Aprobada', 'Rechazada'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Debe ser Aprobada o Rechazada' });
    }
    const resultado = await asistenciaService.resolverJustificacion(id, estado);
    if (!resultado) {
      return res.status(404).json({ error: 'Justificación no encontrada' });
    }
    res.json({ message: `Justificación ${estado.toLowerCase()} con éxito`, data: resultado });
  } catch (error) {
    console.error('Error al resolver justificación:', error);
    res.status(500).json({ error: 'Error al actualizar el estado de la justificación' });
  }
};

module.exports = {
  getAsistenciasByAsamblea,
  registerAsistencia,
  generateFines,
  solicitarJustificacion,
  listarJustificaciones,
  resolverJustificacion,
};