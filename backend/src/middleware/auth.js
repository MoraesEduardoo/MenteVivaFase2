import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/token.js';

export async function requireAuth(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) return next(new AppError('Você precisa fazer login.', 401));

  const payload = verifyToken(token);
  if (!payload?.sub) return next(new AppError('Sessão expirada. Faça login novamente.', 401));

  const user = await User.findById(payload.sub);
  if (!user) return next(new AppError('Usuário não encontrado.', 401));

  req.user = user;
  return next();
}
