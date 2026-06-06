import { MoodEntry } from '../models/MoodEntry.js';

export async function listEntries(req, res) {
  const entries = await MoodEntry.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ data: entries });
}

export async function createEntry(req, res) {
  const { mood, tag, note = '' } = req.body;
  const entry = await MoodEntry.create({ user: req.user._id, mood, tag, note });
  res.status(201).json({ data: entry });
}
