const express = require('express');
const router = express.Router();
const {
  getAsambleas,
  createAsamblea,
  updateAsamblea,
  deleteAsamblea,
} = require('../controllers/asamblea.controller');

router.get('/', getAsambleas);
router.post('/', createAsamblea);
router.put('/', updateAsamblea);
router.put('/:id', updateAsamblea);
router.delete('/', deleteAsamblea);
router.delete('/:id', deleteAsamblea);

module.exports = router;