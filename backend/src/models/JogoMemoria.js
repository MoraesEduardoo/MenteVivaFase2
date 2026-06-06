import mongoose from 'mongoose';

const jogoMemoriaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    won: { type: Boolean, required: true },
    attempts: { type: Number, required: true, min: 1 },
    timeMs: { type: Number, required: true, min: 0 },
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

export const JogoMemoria = mongoose.model('JogoMemoria', jogoMemoriaSchema, 'memoryGame');
