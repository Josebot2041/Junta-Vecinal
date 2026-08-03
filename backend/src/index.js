require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Request logging (dev) ---
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// --- Routes ---
app.use('/api', routes);

// --- 404 handler ---
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Global error handler ---
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { error: err.message }),
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});
