import { JogoMemoria } from '../models/JogoMemoria.js';
import { AppError } from '../utils/AppError.js';

export async function listarResultadosMemoria(req, res) {
  const resultados = await JogoMemoria.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ data: resultados });
}

export async function salvarResultadoMemoria(req, res) {
  const { won, attempts, timeMs } = req.body;

  if (typeof won !== 'boolean' || !Number.isFinite(Number(attempts)) || !Number.isFinite(Number(timeMs))) {
    throw new AppError('Informe vitoria, tentativas e tempo da partida.', 422);
  }

  const resultado = await JogoMemoria.create({
    user: req.user._id,
    won,
    attempts: Number(attempts),
    timeMs: Number(timeMs),
  });

  res.status(201).json({ data: resultado });
}
