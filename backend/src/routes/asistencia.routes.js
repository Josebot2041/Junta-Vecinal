const express = require('express');
const router = express.Router();
const {
  getAsistenciasByAsamblea,
  registerAsistencia,
  generateFines,
  solicitarJustificacion,
  listarJustificaciones,
  resolverJustificacion,
} = require('../controllers/asistencia.controller');

// Justificaciones (rutas específicas antes de param genérico)
router.get('/justificaciones', listarJustificaciones);
router.post('/justificaciones', solicitarJustificacion);
router.patch('/justificaciones/:id/resolver', resolverJustificacion);

router.get('/:asambleaId', getAsistenciasByAsamblea);
router.post('/attendance', registerAsistencia);
router.post('/fines/generate', generateFines);

module.exports = router;