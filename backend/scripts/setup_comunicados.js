const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, database: 'junta_vecinal_db', user: 'postgres', password: 'edithteamo' });

async function setupComunicados() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comunicados (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        categoria VARCHAR(50) DEFAULT 'Informativo',
        descripcion TEXT NOT NULL,
        imagen_url TEXT,
        archivo_nombre VARCHAR(255),
        prioridad VARCHAR(20) DEFAULT 'Normal',
        fecha_evento VARCHAR(50),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla comunicados lista en PostgreSQL.');

    // Verificar si hay registros de prueba, si no hay agregar algunos ejemplos iniciales
    const countRes = await pool.query('SELECT COUNT(*) FROM comunicados');
    if (parseInt(countRes.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO comunicados (titulo, categoria, descripcion, prioridad, fecha_evento)
        VALUES 
        ('Corte de Agua Programado', 'Urgente', 'Informamos a todos los vecinos que el día de mañana se realizará un mantenimiento preventivo en el tanque principal. El servicio será suspendido desde las 08:00 hasta las 14:00.', 'Urgente', 'Mañana 08:00 - 14:00'),
        ('Gran Kermesse Solidaria Pro-Mejoras', 'Evento', 'Invitamos a toda la comunidad a participar de la Kermesse Solidaria para recaudar fondos para el techado de la cancha multifuncional. Habrá platos típicos, música y rifas.', 'Normal', 'Domingo 28 de Noviembre'),
        ('Convocatoria a Marcha Pacífica por Seguridad', 'Convocatoria', 'Hojas de citación firmadas por la directiva de la OTB para marchar pacíficamente hacia la Alcaldía exigiendo mayor patrullaje y luminarias públicas.', 'Alta', 'Viernes 9:00 AM');
      `);
      console.log('Comunicados de prueba iniciales insertados.');
    }
  } catch (error) {
    console.error('Error al configurar tabla comunicados:', error);
  } finally {
    await pool.end();
  }
}

setupComunicados();
