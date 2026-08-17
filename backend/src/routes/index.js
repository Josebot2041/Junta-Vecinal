const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const authRoutes = require('./auth.routes');
const vecinoRoutes = require('./vecino.routes');
const pagoRoutes = require('./pago.routes');
const asambleaRoutes = require('./asamblea.routes');
const asistenciaRoutes = require('./asistencia.routes'); // <-- 1. Importar las rutas de vecinos

// Endpoint principal
router.get('/', (req, res) => {
  res.json({
    message: 'API de Junta Vecinal activa',
    endpoints: {
      health: '/api/health',
      testDb: '/api/test-db',
      login: 'POST /api/auth/login',
      vecinos: '/api/vecinos' // <-- Opcional: guía en la API principal
    }
  });
});

// Comprobaciones
router.get('/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ status: 'ok', timestamp: result.rows[0].now });
  } catch (error) {
    res.status(503).json({ status: 'error', message: error.message });
  }
});

router.get('/test-db', async (req, res) => {
  try {
    const result = await query('SELECT id, ci, nombre, rol FROM usuarios');
    res.json({ status: 'success', total: result.rows.length, usuarios: result.rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Registrar módulos de rutas
router.use('/auth', authRoutes);
router.use('/vecinos', vecinoRoutes);
router.use('/pagos', pagoRoutes);
router.use('/asambleas', asambleaRoutes);
router.use('/asistencias', asistenciaRoutes); // <-- 2. Registrar el middleware de vecinos

module.exports = router;