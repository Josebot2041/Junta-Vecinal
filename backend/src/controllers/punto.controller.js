const puntoService = require('../services/punto.service');

const getPuntos = async (req, res) => {
  try {
    const puntos = await puntoService.getAll();
    res.json(puntos);
  } catch (error) {
    console.error('Error al obtener puntos comunitarios:', error);
    res.status(500).json({ error: 'Error al obtener puntos comunitarios' });
  }
};

const createPunto = async (req, res) => {
  try {
    const { nombre, categoria, latitud, longitud } = req.body;
    if (!nombre || !categoria || !latitud || !longitud) {
      return res.status(400).json({ error: 'Nombre, categoría, latitud y longitud son requeridos' });
    }
    const nuevo = await puntoService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear punto comunitario:', error);
    res.status(500).json({ error: 'Error al registrar el punto comunitario' });
  }
};

module.exports = {
  getPuntos,
  createPunto,
};
