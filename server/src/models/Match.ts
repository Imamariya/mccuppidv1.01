import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['like', 'reject', 'super_like'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for unique matches per day
matchSchema.index({ userId: 1, targetUserId: 1 });

export const Match = mongoose.model('Match', matchSchema);
