import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'message', 'match', 'super_like', 'profile_boost', 'subscription'],
    required: true
  },
  relatedUserId: mongoose.Schema.Types.ObjectId,
  relatedChatId: mongoose.Schema.Types.ObjectId,
  title: String,
  body: String,
  isRead: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export const Notification = mongoose.model('Notification', notificationSchema);
