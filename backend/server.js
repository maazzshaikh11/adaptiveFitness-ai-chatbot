require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/User');
const Chat = require('./models/Chat');
const { generateChatResponse } = require('./services/openaiService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fitness Chatbot API is running' });
});

// Get or create user
app.post('/api/users', async (req, res) => {
  try {
    const { userId, personality } = req.body;

    if (!userId || !personality) {
      return res.status(400).json({ error: 'userId and personality are required' });
    }

    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({
        userId,
        personality,
        lifestyleData: {
          steps: 4200,
          exerciseMinutes: 25,
          sleepHours: 6.5
        }
      });
      await user.save();
    }

    res.json({ user });
  } catch (error) {
    console.error('Error creating/fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user lifestyle data
app.put('/api/users/:userId/lifestyle', async (req, res) => {
  try {
    const { userId } = req.params;
    const { steps, exerciseMinutes, sleepHours } = req.body;

    const user = await User.findOneAndUpdate(
      { userId },
      { 
        $set: {
          'lifestyleData.steps': steps,
          'lifestyleData.exerciseMinutes': exerciseMinutes,
          'lifestyleData.sleepHours': sleepHours,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error updating lifestyle data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Calculate days since first use
function calculateDaysUsing(firstUsedAt) {
  const now = new Date();
  const diff = now - new Date(firstUsedAt);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Send chat message
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    // Get user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get latest chat session or create new one
    let chat = await Chat.findOne({ userId }).sort({ createdAt: -1 });
    
    if (!chat) {
      chat = new Chat({
        userId,
        personality: user.personality,
        lifestyleData: user.lifestyleData,
        messages: []
      });
    }

    // Calculate days using app
    const daysUsing = calculateDaysUsing(user.firstUsedAt);

    // Build conversation history (last 10 messages for context)
    const conversationHistory = chat.messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate AI response
    const { response, isSafetyRefusal } = await generateChatResponse(
      message,
      user.personality,
      daysUsing,
      user.lifestyleData,
      conversationHistory
    );

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    chat.updatedAt = new Date();
    await chat.save();

    // Award coin for user prompt
    user.coins += 1;
    await user.save();

    res.json({
      response,
      isSafetyRefusal,
      coins: user.coins,
      daysUsing
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history
app.get('/api/chat/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ chats });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Get user coins
app.get('/api/users/:userId/coins', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ coins: user.coins });
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
