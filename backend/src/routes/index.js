const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: result.rows[0].now,
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Example: GET /api
router.get('/', (req, res) => {
  res.json({
    message: 'Junta Vecinal API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
    },
  });
});

module.exports = router;
