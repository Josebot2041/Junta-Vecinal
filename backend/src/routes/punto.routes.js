const express = require('express');
const router = express.Router();
const { getPuntos, createPunto } = require('../controllers/punto.controller');

router.get('/', getPuntos);
router.post('/', createPunto);

module.exports = router;
