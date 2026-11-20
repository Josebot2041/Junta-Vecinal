const pagoService = require('../services/pago.service');

// POST /api/pagos
const registrarPago = async (req, res, next) => {
  try {
    const pagoData = req.body;
    const nuevoPago = await pagoService.crear(pagoData);
    res.status(201).json({ 
      message: 'Pago registrado con éxito', 
      data: nuevoPago 
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/pagos
const listarPagos = async (req, res, next) => {
  try {
    const pagos = await pagoService.obtenerTodos();
    res.status(200).json(pagos);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/pagos/:id/cobrar
const cobrarPago = async (req, res, next) => {
  try {
    const pago = await pagoService.cobrarPago(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.status(200).json({ message: 'Pago marcado como cobrado', data: pago });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/pagos/:id
const eliminarPago = async (req, res, next) => {
  try {
    const pago = await pagoService.eliminarPago(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    res.status(200).json({ message: 'Pago eliminado exitosamente', data: pago });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrarPago,
  listarPagos,
  cobrarPago,
  eliminarPago,
};
