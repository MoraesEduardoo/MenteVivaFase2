import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/token.js';

export async function requireAuth(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) return next(new AppError('Voce precisa fazer login.', 401));

  const payload = verifyToken(token);
  if (!payload?.sub) return next(new AppError('Sessao expirada. Faca login novamente.', 401));

  const user = await User.findById(payload.sub);
  if (!user) return next(new AppError('Usuario nao encontrado.', 401));

  req.user = user;
  return next();
}
