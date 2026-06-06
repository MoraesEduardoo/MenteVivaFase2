import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { createToken } from '../utils/token.js';

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Informe nome, e-mail e senha.', 422);
  }

  if (String(password).length < 8) {
    throw new AppError('A senha precisa ter pelo menos 8 caracteres.', 422);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const alreadyExists = await User.exists({ email: normalizedEmail });

  if (alreadyExists) {
    throw new AppError('Este e-mail já está cadastrado.', 409);
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
  });

  res.status(201).json({
    data: {
      user: publicUser(user),
      token: createToken({ sub: user._id.toString() }),
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Informe e-mail e senha.', 422);
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new AppError('E-mail ou senha inválidos.', 401);
  }

  res.json({
    data: {
      user: publicUser(user),
      token: createToken({ sub: user._id.toString() }),
    },
  });
}
