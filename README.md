# Adaptive Fitness Companion Chatbot

An AI-powered mobile fitness companion built with React Native (Expo) and OpenAI API that adapts its coaching style based on user personality, app usage duration, and lifestyle data.

## 🎯 Features

### Core Features
- **Adaptive AI Behavior**: Chatbot adapts based on:
  - User personality (3 types)
  - App usage duration (days using app)
  - Lifestyle context (steps, exercise minutes, sleep hours)
  
- **Personality Types**:
  - **Encouragement Seeker**: Needs motivation and positive reinforcement
  - **Creative Explorer**: Prefers variety and creative approaches
  - **Goal Finisher**: Wants structured plans and clear milestones

- **Safety Guardrails**: Automatically detects and refuses medical advice requests
- **Coin Reward System**: Users earn 1 coin per message sent
- **Structured AI Responses**: Clear, formatted responses with actionable tips
- **Quick Action Suggestions**: Predefined fitness topics for easy exploration

### Tech Stack
- **Frontend**: React Native (Expo Managed Workflow)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: OpenAI GPT-4 API
- **Storage**: AsyncStorage for local user data

## 📋 Prerequisites

- Node.js 20.x (LTS)
- MongoDB (local or Atlas)
- OpenAI API Key
- Expo CLI
- iOS Simulator / Android Emulator (or Expo Go app)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd adaptiveFitness-ai-chatbot
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Configure Environment Variables

**Backend (.env in backend/ directory)**:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
OPENAI_API_KEY=your_actual_openai_api_key
OPENAI_MODEL=gpt-4
DATABASE_URL=mongodb://localhost:27017/fitness-chatbot
PORT=3000
NODE_ENV=development
```

**Frontend (.env in root directory)**:
```bash
cp .env.example .env
```

Edit `.env`:
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 5. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update DATABASE_URL accordingly)
```

### 6. Start Backend Server
```bash
cd backend
npm start

# Or for development with auto-reload
npm run dev
```

Server will run on http://localhost:3000

### 7. Start Expo Frontend
```bash
# In the root directory
npm start
```

## 📱 Running the App

After starting Expo:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 🏗️ Project Structure

```
adaptiveFitness-ai-chatbot/
├── app/                          # Expo Router pages
│   ├── (tabs)/
│   │   └── index.tsx            # Home/Welcome screen
│   ├── chat.tsx                 # Main chat interface
│   └── _layout.tsx
├── backend/                      # Node.js Express server
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Chat.js              # Chat history schema
│   ├── services/
│   │   └── openaiService.js     # OpenAI integration & prompt composition
│   ├── server.js                # Express server
│   └── package.json
├── components/                   # Reusable React components
│   ├── PersonalityCard.tsx
│   ├── ChatMessage.tsx
│   ├── QuickActionButton.tsx
│   └── LoadingIndicator.tsx
├── constants/
│   ├── personalities.ts         # Personality definitions & FAQs
│   └── theme.ts
├── services/
│   └── api.ts                   # Frontend API client
├── types/
│   └── index.ts                 # TypeScript type definitions
└── README.md
```

## 🤖 AI Prompt Composition Strategy

### System Prompt Components

The AI behavior is dynamically composed from multiple context layers:

#### 1. Base Safety Rules
```
- Not a medical professional
- Cannot diagnose or treat conditions
- Refuses medical/injury/medication advice
- Suggests consulting healthcare professionals
```

#### 2. Personality-Based Behavior

**Encouragement Seeker**:
- Frequent reassurance and positive reinforcement
- Celebrates small wins
- Uses encouraging phrases
- Breaks goals into smaller milestones

**Creative Explorer**:
- Offers creative workout ideas
- Avoids repetitive information
- Uses metaphors and analogies
- Encourages exploration of activities

**Goal Finisher**:
- Provides structured, actionable plans
- Uses numbered lists and schedules
- Focuses on measurable progress
- Direct and efficient communication

#### 3. Usage Duration Adaptation

**Days 0-3** (New User):
- Grounded and empathetic
- Listens more than prescribes
- No instant remedies unless asked
- Builds trust through understanding

**Days 4-8** (Getting Familiar):
- Friendly listener
- Offers short remedies after 2 exchanges
- Balances listening with suggestions
- Shows context awareness

**Days 9+** (Established User):
- Experienced coach mode
- Actionable guidance after 1 message
- More directive while supportive
- Assumes trust and expertise

#### 4. Lifestyle Context Integration

Real-time incorporation of:
- **Daily Steps**: Encourages more movement if low
- **Exercise Minutes**: Acknowledges effort, suggests variations
- **Sleep Hours**: Emphasizes recovery if insufficient

### Example Prompt Composition

```javascript
User Context:
- Personality: Encouragement Seeker
- Days Using: 5 (Friendly Listener mode)
- Steps: 3000
- Exercise: 15 minutes
- Sleep: 5.5 hours

Generated System Prompt:
"You are an adaptive AI fitness companion...
[Base Safety Rules]
[Encouragement Seeker personality traits]
[Days 4-8 coaching style]
Current Data: Steps: 3000, Exercise: 15min, Sleep: 5.5hrs
[Suggests more walking, acknowledges effort, mentions recovery]"
```

## 🛡️ Safety & Scope Handling

### Safety Mechanisms

**1. Keyword-Based Filtering**:
```javascript
const MEDICAL_KEYWORDS = [
  'disease', 'diabetes', 'injury', 'fracture',
  'medication', 'medicine', 'drug', 'supplement'
];
```

**2. Refusal Response**:
When medical content detected:
```
"I appreciate your question, but I'm not able to provide 
advice on medical conditions, injuries, or medications.

As a fitness companion, I'm here to help with:
✓ Workout plans and exercises
✓ Fitness tips and techniques
✓ Motivation and consistency
✓ General wellness guidance

For medical concerns, please consult:
• Licensed physician
• Certified physical therapist
• Sports medicine specialist"
```

**3. System-Level Prompt Instructions**:
Every OpenAI request includes safety rules in the system prompt.

## 🎨 UI/UX Highlights

- Clean, modern interface with personality-specific colors
- Chat-style conversation (user right, AI left)
- Loading indicators for AI responses
- Quick action pills for common queries
- Coin display to gamify engagement
- Smooth scrolling and keyboard handling

## 🔄 API Endpoints

### User Management
- `POST /api/users` - Create new user
- `PUT /api/users/:userId/lifestyle` - Update lifestyle data
- `GET /api/users/:userId/coins` - Get user coins

### Chat
- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/:userId` - Get chat history

### Health
- `GET /health` - Server health check

## 📊 Database Schema

### User Model
```javascript
{
  userId: String (unique),
  personality: String (enum),
  firstUsedAt: Date,
  coins: Number,
  lifestyleData: {
    steps: Number,
    exerciseMinutes: Number,
    sleepHours: Number
  }
}
```

### Chat Model
```javascript
{
  userId: String,
  personality: String,
  messages: [{
    role: String ('user' | 'assistant'),
    content: String,
    timestamp: Date
  }],
  lifestyleData: Object
}
```

## 🧪 Testing

### Test Scenarios

1. **Personality Adaptation**:
   - Create users with different personalities
   - Observe different response styles

2. **Duration Adaptation**:
   - Test with new user (days 0-3)
   - Modify `firstUsedAt` to simulate days 4-8 and 9+
   - Observe coaching style changes

3. **Safety Refusals**:
   - Ask about injuries: "How do I treat my ankle sprain?"
   - Ask about diseases: "I have diabetes, what exercises?"
   - Ask about medication: "Should I take protein supplements?"
   - Verify refusal responses

4. **Lifestyle Context**:
   - Set low steps (e.g., 1000) - should encourage walking
   - Set low sleep (e.g., 4 hours) - should mention recovery
   - Set high exercise - should acknowledge effort

## 🚧 Known Limitations

- Dummy lifestyle data (no real wearable integration)
- Single chat session per user (no multiple conversations)
- Basic error handling
- No user authentication
- No message editing/deletion
- No conversation export

## 🎯 Future Enhancements

- [ ] Wearable device integration (Apple Health, Google Fit)
- [ ] Multiple chat sessions
- [ ] Voice input/output
- [ ] Workout video demonstrations
- [ ] Progress tracking charts
- [ ] Social features (share workouts)
- [ ] Push notifications for motivation
- [ ] Offline mode
- [ ] Multi-language support

## 🤝 Contributing

This is an assignment project. For production use, consider:
- Add proper authentication
- Implement rate limiting
- Add comprehensive error handling
- Write unit and integration tests
- Add monitoring and logging
- Implement data encryption

## 📄 License

This project is for educational/assignment purposes.

## 👨‍💻 Author

Created for the React Native + OpenAI API assignment.

---

**Note**: Remember to never commit your `.env` files with actual API keys!

# adaptiveFitness
