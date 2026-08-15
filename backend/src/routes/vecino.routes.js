const { Router } = require('express');
const vecinoController = require('../controllers/vecino.controller');

const router = Router();

router.get('/', vecinoController.getVecinos);
router.post('/', vecinoController.createVecino);

module.exports = router;