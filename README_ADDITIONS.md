# README Additions

Add these sections to your main README.md file for submission:

---

## ✨ Bonus Features Implemented

### 1. 🪙 Coin-Based Reward System
Users earn **1 coin for every prompt** they send. Coins are displayed with an animated notification and tracked persistently.

**Features:**
- Animated coin reward (+1 floats and fades)
- Gold badge display in chat header
- Backend persistence across sessions

### 2. 📚 RAG-lite with Fitness FAQ
**10+ curated fitness Q&A** items are stored locally and used to:
- Provide instant answers for common questions
- Enrich AI prompts with relevant context
- Suggest related follow-up questions

**Benefits:**
- Faster responses (no API call for FAQs)
- Consistent answers for common queries
- Smart question suggestions

### 3. 📜 Chat History
View your **last 10 conversations** with smart date formatting, message counts, and clean UI.

**Features:**
- Date labels (Today, Yesterday, specific dates)
- Message count badges
- Conversation previews
- Empty state for new users

### 4. 🎨 Theming & Professional Branding
- **Clean typography** with proper hierarchy
- **Thoughtful color palette**: Turquoise (#4ECDC4) for energy, Gold (#FFD700) for rewards
- **Consistent styling** across all screens
- **Professional look** suitable for production

### 5. ✨ Animations & Gamification
- **Coin animations** - Smooth reward feedback
- **Message transitions** - Slide-in effects
- **Button haptics** - Touch feedback
- **Loading states** - Pulse animations
- **Gamification** - Progressive user engagement

---

## 🤖 AI Model Used

This project uses **Grok API (X.AI)** instead of OpenAI.

**Configuration:**
- **Model**: `grok-beta`
- **API Base**: `https://api.x.ai/v1`
- **Free Tier**: Available

**Why Grok?**
- OpenAI-compatible API format
- Free tier access
- Good performance for fitness coaching

---

## 🎯 Prompt Composition Strategy

Every request to Grok combines multiple context layers:

```javascript
System Prompt = 
  Base Instructions (Safety rules, role definition)
  + Personality Guidelines (Encouragement Seeker / Creative Explorer / Goal Finisher)
  + Usage Duration Behavior (Days 0-3 / 4-8 / 9+)
  + Lifestyle Context (Steps, exercise mins, sleep hours)
  + RAG Context (Relevant FAQ data if available)
  
User Message = 
  Original question
  + Enriched FAQ context (when relevant)
```

### Personality Adaptation:
- **Encouragement Seeker**: Supportive, celebrates wins, frequent motivation
- **Creative Explorer**: Variety-focused, engaging, non-repetitive
- **Goal Finisher**: Structured, actionable, results-oriented

### Usage Duration Coaching:
- **Days 0-3**: Empathetic listener, asks questions, builds trust
- **Days 4-8**: Friendly coach, balanced advice after 2 messages
- **Days 9+**: Experienced coach, direct guidance after 1 message

### Lifestyle Integration:
```javascript
if (steps < 5000) → Encourage more walking
if (exerciseMinutes > 60) → Acknowledge dedication
if (sleepHours < 7) → Emphasize recovery importance
```

---

## 🛡️ Safety & Refusal Handling

### Medical Content Detection:
Keyword-based filtering for:
- Diseases (diabetes, heart disease, cancer)
- Injuries (fractures, tears, chronic pain)
- Medications (drugs, supplements, prescriptions)

### Refusal Response:
When medical content is detected:
1. Politely decline to provide medical advice
2. Explain scope (fitness only, not medical)
3. Suggest consulting licensed professionals
4. Offer alternative fitness guidance

### Implementation:
```javascript
// Backend: services/grokService.js
const MEDICAL_KEYWORDS = ['disease', 'injury', 'medication', ...];

if (containsMedicalContent(userMessage)) {
  return {
    response: "I'm not able to provide advice on medical conditions...",
    isSafetyRefusal: true
  };
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 20.x (LTS)
- MongoDB
- Grok API key from [console.x.ai](https://console.x.ai)
- Expo CLI

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env and add your GROK_API_KEY
npm install
npm run dev
```

### Frontend Setup
```bash
# In project root
npm install
npx expo start
```

### Environment Variables

**Backend (.env):**
```env
GROK_API_KEY=xai-your_actual_key_here
GROK_BASE_URL=https://api.x.ai/v1
GROK_MODEL=grok-beta
DATABASE_URL=mongodb://localhost:27017/fitness-chatbot
PORT=3000
NODE_ENV=development
```

**Frontend:**
No environment setup needed - connects to localhost:3000 by default.

For production, update `services/api.ts`:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
```

---

## 📱 Running the App

```bash
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
npx expo start

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app
```

---

## 🧪 Testing

See `TESTING_GUIDE.md` for comprehensive testing instructions.

**Quick Tests:**
1. Personality selection and change
2. Send messages and earn coins
3. Ask FAQ: "What are good warm-up exercises?"
4. Check chat history
5. Test safety: "I have diabetes, what should I do?"

---

## 📊 Project Structure

```
adaptiveFitness-ai-chatbot/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home/Personality screen
│   │   └── explore.tsx      
│   ├── chat.tsx             # Main chat screen
│   └── history.tsx          # Chat history screen
├── components/              # Reusable components
│   ├── ChatMessage.tsx
│   ├── CoinAnimation.tsx    # Coin reward animation
│   ├── PersonalityCard.tsx
│   └── ...
├── services/               # API and utility services
│   ├── api.ts              # Backend API calls
│   └── ragService.ts       # RAG-lite FAQ logic
├── constants/              # App constants
│   ├── personalities.ts    # Personality definitions + FAQs
│   └── theme.ts            # Color palette
├── backend/                # Node.js/Express backend
│   ├── server.js           # Main server
│   ├── models/             # MongoDB schemas
│   └── services/
│       └── grokService.js  # Grok API integration
└── types/                  # TypeScript definitions
```

---

## 🎬 Demo Video

The demo video showcases:
1. ✅ Welcome screen & personality selection
2. ✅ Chat interaction with Grok AI
3. ✅ Personality-based responses
4. ✅ Coin reward system
5. ✅ RAG-lite FAQ answers
6. ✅ Chat history feature
7. ✅ Safety refusal example
8. ✅ Animations and theming

**Duration**: 2-5 minutes  
**Format**: Screen recording with audio

---

## 🛠️ Tech Stack

### Frontend
- React Native (Expo SDK 54)
- TypeScript
- Expo Router (File-based routing)
- AsyncStorage (Persistence)
- Animated API (Animations)

### Backend
- Node.js 20.x
- Express.js
- MongoDB + Mongoose
- Axios (HTTP client)

### AI
- Grok API (X.AI)
- Model: grok-beta
- RAG-lite with local FAQs

---

## 📝 AI Tools Used

All AI assistance used in development is documented in `AI_README.md`:

- **Claude (Anthropic)** for:
  - Code architecture and implementation
  - Component design
  - RAG service implementation
  - Bug fixing and optimization
  - Documentation writing

**Prompts used:**
- "Implement coin animation with React Native Animated API"
- "Create RAG service for FAQ matching with TypeScript"
- "Fix personality selection persistence issue"
- "Add chat history screen with date formatting"
- [Full list in AI_README.md]

---

## 🏆 Achievements

### Mandatory Features: ✅ All Implemented
- Welcome/Home screen
- Chat interface with structured responses
- 3 personality types with adaptation
- Usage duration-based coaching
- Lifestyle data integration
- Safety guardrails

### Bonus Features: ✅ All Implemented
- Coin reward system with animation
- RAG-lite with 10+ FAQs
- Chat history screen
- Professional theming
- Smooth animations
- Gamification elements

### Extra Features:
- Personality change capability
- Suggested questions system
- FAQ context enrichment
- Grok API integration
- Comprehensive documentation

---

## 📄 License

This project was created as part of a React Native assignment.

---

## 👤 Author

Mohammed Shaikh  
[Your contact info]

---

## 🙏 Acknowledgments

- Anthropic Claude for development assistance
- X.AI for Grok API access
- React Native and Expo teams
- Assignment evaluators

---

## 📞 Support

For issues or questions:
1. Check `TESTING_GUIDE.md`
2. Review `BONUS_FEATURES_IMPLEMENTATION.md`
3. See `GROK_MIGRATION_GUIDE.md` for API setup

---

*Built with ❤️ and lots of 🤖 AI assistance*
