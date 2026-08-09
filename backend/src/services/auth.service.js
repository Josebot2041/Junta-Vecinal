const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (ci, password) => {
  // 1. Buscar usuario por CI
  const result = await query('SELECT * FROM usuarios WHERE ci = $1', [ci]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // 2. Verificar contraseña (compara con bcrypt o texto plano de prueba)
  let isMatch = false;
  if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    isMatch = (password === user.password);
  }

  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  // 3. Generar token JWT
  const token = jwt.sign(
    { id: user.id, ci: user.ci, rol: user.rol },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '8h' }
  );

  // Excluir la contraseña de la respuesta
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

module.exports = { loginUser };