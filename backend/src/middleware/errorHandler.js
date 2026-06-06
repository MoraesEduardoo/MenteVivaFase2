import { AppError } from '../utils/AppError.js';

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message, details: error.details });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}
