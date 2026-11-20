const express = require('express');
const router = express.Router();
const comunicadoController = require('../controllers/comunicado.controller');

router.get('/', comunicadoController.listar);
router.get('/:id', comunicadoController.obtenerPorId);
router.post('/', comunicadoController.crear);
router.put('/:id', comunicadoController.actualizar);
router.delete('/:id', comunicadoController.eliminar);

module.exports = router;
