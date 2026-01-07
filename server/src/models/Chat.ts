import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    mediaUrl: String,
    mediaType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessage: {
    content: String,
    sentAt: Date,
    senderId: mongoose.Schema.Types.ObjectId
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Chat = mongoose.model('Chat', chatSchema);
