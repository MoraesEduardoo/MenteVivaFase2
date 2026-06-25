import { MoodEntry } from '../models/MoodEntry.js';
import { AppError } from '../utils/AppError.js';

export async function listEntries(req, res) {
  const entries = await MoodEntry.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ data: entries });
}

export async function createEntry(req, res) {
  const { mood, tag, note = '' } = req.body;
  const entry = await MoodEntry.create({ user: req.user._id, mood, tag, note });
  res.status(201).json({ data: entry });
}

export async function updateEntry(req, res) {
  const { mood, tag, note = '' } = req.body;

  if (!mood || !tag) {
    throw new AppError('Informe humor e assunto para atualizar o registro.', 422);
  }

  const entry = await MoodEntry.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { mood, tag, note },
    { new: true, runValidators: true },
  );

  if (!entry) {
    throw new AppError('Registro nao encontrado.', 404);
  }

  res.json({ data: entry });
}

export async function deleteEntry(req, res) {
  const entry = await MoodEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!entry) {
    throw new AppError('Registro nao encontrado.', 404);
  }

  res.status(204).send();
}
