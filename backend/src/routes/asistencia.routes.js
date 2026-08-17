const express = require('express');
const router = express.Router();
const {
  getAsistenciasByAsamblea,
  registerAsistencia,
  generateFines,
} = require('../controllers/asistencia.controller');

router.get('/:asambleaId', getAsistenciasByAsamblea);
router.post('/attendance', registerAsistencia);
router.post('/fines/generate', generateFines);

module.exports = router;