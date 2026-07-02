import { AppError } from '../utils/AppError.js';

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message, details: error.details });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: 'Este e-mail ja esta cadastrado.' });
  }

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors || {}).map((item) => item.message);
    return res.status(422).json({ message: 'Dados invalidos.', details });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador invalido.' });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ message: 'JSON invalido no corpo da requisicao.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}
