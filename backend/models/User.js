const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  personality: {
    type: String,
    enum: ['encouragement_seeker', 'creative_explorer', 'goal_finisher'],
    required: true
  },
  firstUsedAt: {
    type: Date,
    default: Date.now
  },
  coins: {
    type: Number,
    default: 0
  },
  lifestyleData: {
    steps: {
      type: Number,
      default: 0
    },
    exerciseMinutes: {
      type: Number,
      default: 0
    },
    sleepHours: {
      type: Number,
      default: 7
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
