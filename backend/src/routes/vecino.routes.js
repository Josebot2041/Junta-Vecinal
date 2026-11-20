const { Router } = require('express');
const vecinoController = require('../controllers/vecino.controller');

const router = Router();

router.get('/', vecinoController.getVecinos);
router.post('/', vecinoController.createVecino);
router.put('/:id', vecinoController.updateVecino);
router.delete('/:id', vecinoController.deleteVecino);
router.get('/:id/historial', vecinoController.getHistorial);

module.exports = router;
