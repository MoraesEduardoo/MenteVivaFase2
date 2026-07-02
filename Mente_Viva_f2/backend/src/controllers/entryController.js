import mongoose from 'mongoose';

import { MoodEntry } from '../models/MoodEntry.js';
import { AppError } from '../utils/AppError.js';

function validateEntryPayload(body) {
  const mood = String(body?.mood || '').trim();
  const tag = String(body?.tag || '').trim();
  const note = String(body?.note || '').trim();

  if (!mood || !tag) {
    throw new AppError('Informe humor e assunto do registro.', 422);
  }

  if (note.length > 1200) {
    throw new AppError('A anotacao deve ter no maximo 1200 caracteres.', 422);
  }

  return { mood, tag, note };
}

function ensureValidId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Identificador invalido.', 400);
  }
}

export async function listEntries(req, res) {
  const entries = await MoodEntry.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ data: entries });
}

export async function createEntry(req, res) {
  const data = validateEntryPayload(req.body);
  const entry = await MoodEntry.create({ user: req.user._id, ...data });
  res.status(201).json({ data: entry });
}

export async function updateEntry(req, res) {
  ensureValidId(req.params.id);
  const data = validateEntryPayload(req.body);

  const entry = await MoodEntry.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    data,
    { new: true, runValidators: true },
  );

  if (!entry) {
    throw new AppError('Registro nao encontrado.', 404);
  }

  res.json({ data: entry });
}

export async function deleteEntry(req, res) {
  ensureValidId(req.params.id);
  const entry = await MoodEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!entry) {
    throw new AppError('Registro nao encontrado.', 404);
  }

  res.status(204).send();
}
