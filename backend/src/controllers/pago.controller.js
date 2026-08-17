const pagoService = require('../services/pago.service');

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

const listarPagos = async (req, res, next) => {
  try {
    const pagos = await pagoService.obtenerTodos();
    res.status(200).json(pagos);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrarPago,
  listarPagos
};