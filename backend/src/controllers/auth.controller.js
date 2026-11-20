const authService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const { ci, password } = req.body;

    if (!ci || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'El CI y la contraseña son requeridos' 
      });
    }

    const { user, token } = await authService.loginUser(ci, password);

    res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: { user, token }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message || 'Error en la autenticación'
    });
  }
};

const register = async (req, res) => {
  try {
    const { ci, nombre, password } = req.body;

    if (!ci || !nombre || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'El CI, nombre y contraseña son requeridos'
      });
    }

    const { user, token } = await authService.registerVecino(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Cuenta de vecino creada exitosamente',
      data: { user, token }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message || 'Error al registrar la cuenta'
    });
  }
};

module.exports = { login, register };
