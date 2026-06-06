import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true },
    tag: { type: String, required: true },
    note: { type: String, default: '', maxlength: 1200 },
  },
  { timestamps: true },
);

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema, 'diary');
