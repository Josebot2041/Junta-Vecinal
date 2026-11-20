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

  // Excluir la contraseña de la respuesta y adjuntar datos de lote/manzano si existen
  const { password: _, ...userWithoutPassword } = user;

  const vecinoRes = await query('SELECT id, manzano, lote, estado_cuenta, saldo FROM vecinos WHERE ci = $1', [ci]);
  const vecinoInfo = vecinoRes.rows[0] || {};

  return { 
    user: { 
      ...userWithoutPassword, 
      vecino_id: vecinoInfo.id || null,
      manzano: vecinoInfo.manzano || null,
      lote: vecinoInfo.lote || null,
      estado_cuenta: vecinoInfo.estado_cuenta || 'Al día',
      saldo: vecinoInfo.saldo || '0.00'
    }, 
    token 
  };
};

const registerVecino = async (data) => {
  const { ci, nombre, password, telefono, manzano, lote, direccion } = data;

  if (!ci || !nombre || !password) {
    throw new Error('CI, nombre y contraseña son obligatorios');
  }

  // 1. Verificar si ya existe usuario con ese CI
  const existingUser = await query('SELECT id FROM usuarios WHERE ci = $1', [ci]);
  if (existingUser.rows.length > 0) {
    throw new Error('Ya existe una cuenta de usuario con este CI');
  }

  // 2. Hashear contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Registrar usuario con rol 'vecino'
  const userResult = await query(
    `INSERT INTO usuarios (ci, nombre, password, rol)
     VALUES ($1, $2, $3, 'vecino')
     RETURNING id, ci, nombre, rol, creado_en`,
    [ci, nombre, hashedPassword]
  );
  const newUser = userResult.rows[0];

  // 4. Verificar o crear ficha en tabla vecinos
  const existingVecino = await query('SELECT id FROM vecinos WHERE ci = $1', [ci]);
  let vecinoId = null;
  if (existingVecino.rows.length === 0) {
    const vRes = await query(
      `INSERT INTO vecinos (nombre, ci, telefono, manzano, lote, direccion, estado_cuenta, saldo)
       VALUES ($1, $2, $3, $4, $5, $6, 'Al día', 0.00)
       RETURNING id`,
      [nombre, ci, telefono || null, manzano || 'D-1', lote || '1', direccion || '']
    );
    vecinoId = vRes.rows[0].id;
  } else {
    vecinoId = existingVecino.rows[0].id;
    if (telefono || manzano || lote) {
      await query(
        `UPDATE vecinos 
         SET telefono = COALESCE($1, telefono),
             manzano = COALESCE($2, manzano),
             lote = COALESCE($3, lote),
             direccion = COALESCE($4, direccion)
         WHERE ci = $5`,
        [telefono, manzano, lote, direccion, ci]
      );
    }
  }

  // 5. Generar token
  const token = jwt.sign(
    { id: newUser.id, ci: newUser.ci, rol: newUser.rol },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '8h' }
  );

  return {
    user: {
      ...newUser,
      vecino_id: vecinoId,
      manzano: manzano || 'D-1',
      lote: lote || '1',
      estado_cuenta: 'Al día',
      saldo: '0.00'
    },
    token
  };
};

module.exports = { loginUser, registerVecino };
