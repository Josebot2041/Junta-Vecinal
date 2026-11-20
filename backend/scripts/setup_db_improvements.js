const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'junta_vecinal_db',
  user: 'postgres',
  password: 'edithteamo',
});

async function run() {
  try {
    // 1. Agregar comprobante_url a pagos
    await pool.query(`
      ALTER TABLE pagos 
      ADD COLUMN IF NOT EXISTS comprobante_url TEXT;
    `);
    console.log('✓ Columna comprobante_url verificada en pagos');

    // 2. Crear tabla justificaciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS justificaciones (
        id SERIAL PRIMARY KEY,
        asamblea_id INT REFERENCES asambleas(id) ON DELETE CASCADE,
        vecino_id INT REFERENCES vecinos(id) ON DELETE CASCADE,
        motivo VARCHAR(100) NOT NULL,
        descripcion TEXT,
        documento_url TEXT,
        estado VARCHAR(20) DEFAULT 'Pendiente',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabla justificaciones creada');

    // 3. Crear tabla confirmaciones_asamblea
    await pool.query(`
      CREATE TABLE IF NOT EXISTS confirmaciones_asamblea (
        id SERIAL PRIMARY KEY,
        asamblea_id INT REFERENCES asambleas(id) ON DELETE CASCADE,
        vecino_id INT REFERENCES vecinos(id) ON DELETE CASCADE,
        confirmado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(asamblea_id, vecino_id)
      );
    `);
    console.log('✓ Tabla confirmaciones_asamblea creada');

    // 4. Crear tabla puntos_comunitarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS puntos_comunitarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        latitud NUMERIC(10, 7) NOT NULL,
        longitud NUMERIC(10, 7) NOT NULL,
        descripcion TEXT,
        horarios VARCHAR(100),
        icono VARCHAR(50)
      );
    `);
    console.log('✓ Tabla puntos_comunitarios creada');

    // Poblar puntos comunitarios de Cochabamba / Villa Calama si está vacía
    const puntosCount = await pool.query('SELECT COUNT(*) FROM puntos_comunitarios');
    if (parseInt(puntosCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO puntos_comunitarios (nombre, categoria, latitud, longitud, descripcion, horarios, icono)
        VALUES 
        ('Sede Social Comunal OTB', 'Equipamiento', -17.3938000, -66.1570000, 'Salón principal de asambleas, reuniones de directiva y eventos institucionales.', 'Lunes a Sábado 08:00 - 18:00', 'apartment'),
        ('Cancha Multifuncional y Polideportivo', 'Deportivo', -17.3945000, -66.1582000, 'Cancha con iluminación LED para campeonatos de fútbol de salón, básquet y kermesses.', 'Abierto de 06:00 a 22:00', 'sports_soccer'),
        ('Plaza Central y Parque Infantil', 'Recreativo', -17.3932000, -66.1560000, 'Área verde de esparcimiento familiar, juegos infantiles y punto de auxilio para cisterna.', 'Acceso Libre 24/7', 'park'),
        ('Módulo Policial EPI / Vigilancia', 'Seguridad', -17.3920000, -66.1550000, 'Puesto de auxilio rápido de la Policía Comunitaria y botón de pánico vecinal.', 'Atención 24/7 - Tel: 110', 'local_police'),
        ('Punto Limpio y Contenedores EMSA', 'Servicios', -17.3950000, -66.1590000, 'Contenedores verdes para residuos sólidos. Carro recolector pasa Martes, Jueves y Sábados.', 'Martes, Jueves y Sábados 07:00', 'delete');
      `);
      console.log('✓ Puntos comunitarios iniciales insertados');
    }

    console.log('Todos los esquemas de base de datos actualizados con éxito.');
  } catch (err) {
    console.error('Error al actualizar base de datos:', err);
  } finally {
    await pool.end();
  }
}

run();
