import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active'
  },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  startDate: Date,
  endDate: Date,
  autoRenew: {
    type: Boolean,
    default: true
  },
  features: {
    unlimitedLikes: Boolean,
    unlimitedMessages: Boolean,
    advancedFilters: Boolean,
    profileBoost: Boolean,
    superLikes: { type: Number, default: 0 },
    priorityMatches: Boolean
  },
  amount: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
