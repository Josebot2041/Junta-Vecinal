const express = require('express');
const router = express.Router();
const {
  getAsambleas,
  createAsamblea,
  updateAsamblea,
  deleteAsamblea,
  confirmarAsistencia,
  getPreQuorum,
} = require('../controllers/asamblea.controller');

router.get('/', getAsambleas);
router.post('/', createAsamblea);
router.put('/', updateAsamblea);
router.put('/:id', updateAsamblea);
router.delete('/', deleteAsamblea);
router.delete('/:id', deleteAsamblea);

router.post('/:id/confirmar', confirmarAsistencia);
router.get('/:id/pre-quorum', getPreQuorum);

module.exports = router;