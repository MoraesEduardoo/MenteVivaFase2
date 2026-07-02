import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true, trim: true, maxlength: 40 },
    tag: { type: String, required: true, trim: true, maxlength: 40 },
    note: { type: String, default: '', trim: true, maxlength: 1200 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema, 'diary');
