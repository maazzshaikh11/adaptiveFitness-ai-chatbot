const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  personality: {
    type: String,
    enum: ['encouragement_seeker', 'creative_explorer', 'goal_finisher'],
    required: true
  },
  messages: [messageSchema],
  lifestyleData: {
    steps: Number,
    exerciseMinutes: Number,
    sleepHours: Number
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

chatSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Chat', chatSchema);
