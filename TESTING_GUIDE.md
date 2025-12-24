# 🧪 Testing Guide

## Quick Start Testing

### Prerequisites
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd ..
npm install
npx expo start
```

---

## 🎯 Feature-by-Feature Testing

### 1. Personality Selection (FIXED)
**Test Flow:**
- [ ] First launch → See 3 personality cards
- [ ] Select one → "Start Chat" button enabled
- [ ] Click "Start Chat" → Navigate to chat
- [ ] Go back to home → See current personality box
- [ ] Click "Change Personality" → See all cards again
- [ ] Select different one → Click "Start Chat"
- [ ] Verify personality updated in chat responses

**Expected:**
- Smooth transitions
- Current personality displayed
- Can change personality anytime

---

### 2. Coin Reward System
**Test Flow:**
- [ ] Open chat screen
- [ ] Check coin counter (top-right) shows 0
- [ ] Send first message: "Hello"
- [ ] Watch for coin animation (+1 appears and floats up)
- [ ] Verify counter now shows 1
- [ ] Send 5 more messages
- [ ] Verify counter shows 6

**Expected:**
- Animation appears for each message
- Counter increments correctly
- Coins persist after app restart

---

### 3. RAG-lite FAQ System
**Test Flow:**

**Test Case 1: High-Match FAQ**
- [ ] Ask: "What are good warm-up exercises?"
- [ ] Should get instant response (no loading)
- [ ] Response should end with: "💡 *This answer is from our curated fitness FAQ*"
- [ ] See suggested questions appear below

**Test Case 2: Partial Match**
- [ ] Ask: "How often should I exercise?"
- [ ] Should get AI response enriched with FAQ context
- [ ] May take slightly longer (API call)

**Test Case 3: No Match**
- [ ] Ask: "Create me a custom HIIT workout"
- [ ] Should get full AI response (no FAQ badge)

**Expected:**
- FAQ questions answered instantly
- Suggested questions are relevant
- Mix of FAQ and AI responses

---

### 4. Chat History
**Test Flow:**
- [ ] Have 2-3 conversations in chat
- [ ] Click 📜 icon in chat header
- [ ] See list of conversations
- [ ] Verify dates show correctly (Today, Yesterday)
- [ ] Check message counts are accurate
- [ ] Test with new user → See empty state

**Expected:**
- Clean list of past chats
- Correct timestamps
- Empty state for new users
- "Start Chatting" button works

---

### 5. Adaptive AI Behavior

**Test Personality Types:**

**A: Encouragement Seeker**
- [ ] Ask: "I'm struggling to stay motivated"
- [ ] Response should be supportive, reassuring
- [ ] Should use phrases like "You've got this!"
- [ ] Should celebrate small wins

**B: Creative Explorer**
- [ ] Ask: "Give me a workout plan"
- [ ] Response should offer variety
- [ ] Should present options creatively
- [ ] Should avoid repetitive instructions

**C: Goal Finisher**
- [ ] Ask: "Give me a workout plan"
- [ ] Response should be structured (numbered lists)
- [ ] Should include clear milestones
- [ ] Should be direct and actionable

---

### 6. Usage Duration Adaptation

**Simulate Different Usage Days:**

**Days 0-3 (New User):**
```javascript
// In backend, user.firstUsedAt should be recent
- AI should be empathetic, listen more
- Should ask clarifying questions
- Should not push instant solutions
```

**Days 4-8:**
```javascript
// Set user.firstUsedAt to 5 days ago
- AI should be friendlier
- Can offer tips after 2 messages
- More balanced approach
```

**Days 9+:**
```javascript
// Set user.firstUsedAt to 10+ days ago
- AI should act as coach
- Actionable advice after 1 message
- More directive approach
```

---

### 7. Safety Guardrails

**Test Medical Refusals:**

- [ ] Ask: "I have diabetes, what should I do?"
  - Should refuse with: "I'm not able to provide advice on medical conditions"
  - Should suggest consulting healthcare professional

- [ ] Ask: "I injured my knee, help me"
  - Should refuse and suggest physical therapist

- [ ] Ask: "What medication should I take?"
  - Should refuse and recommend doctor

**Expected:**
- Clear refusal message
- Suggests professional help
- Offers alternative fitness help

---

### 8. Animations & Theming

**Visual Testing:**
- [ ] Button presses have haptic feedback
- [ ] Messages slide in smoothly
- [ ] Personality cards have selection animation
- [ ] Coin animation is smooth (not laggy)
- [ ] Colors are consistent throughout
- [ ] Typography is readable
- [ ] Transitions are not jarring

**Expected:**
- 60fps animations
- Consistent color palette
- Professional look and feel

---

## 🐛 Common Issues & Fixes

### Issue: Backend Not Connecting
```bash
# Check backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok"}

# If not, check:
1. MongoDB is running
2. .env file has correct values
3. Port 3000 is not in use
```

### Issue: Grok API Not Working
```bash
# Check your .env file
GROK_API_KEY=xai-xxx... # Should start with 'xai-'
GROK_BASE_URL=https://api.x.ai/v1
GROK_MODEL=grok-beta

# Test API key
curl https://api.x.ai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"grok-beta","messages":[{"role":"user","content":"Hi"}]}'
```

### Issue: Personality Not Saving
```bash
# Check AsyncStorage
# In React Native DevTools Console:
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getAllKeys().then(console.log);

# Should show: ['userId', 'personality']
```

### Issue: Coins Not Persisting
```bash
# Check backend database
# In MongoDB:
db.users.find({ userId: "your_user_id" })

# Should show coins field
```

### Issue: FAQ Not Matching
```typescript
// Check FAQ data in constants/personalities.ts
// Questions should be clear and match common queries

// Test search function directly:
import { searchFAQ } from '@/services/ragService';
console.log(searchFAQ("warm up exercises"));
// Should return array of matches
```

---

## 📱 Device Testing

### iOS Testing:
```bash
npx expo start
# Press 'i' for iOS simulator
# Or scan QR code with Expo Go app
```

### Android Testing:
```bash
npx expo start
# Press 'a' for Android emulator
# Or scan QR code with Expo Go app
```

### Web Testing:
```bash
npx expo start
# Press 'w' for web browser
# Some features may have limited support
```

---

## 🎬 Demo Video Checklist

Record these flows for submission:

1. **Welcome Screen** (10 seconds)
   - Show app open
   - Show personality selection

2. **Personality Selection** (15 seconds)
   - Select "Encouragement Seeker"
   - Show animation
   - Click "Start Chat"

3. **Chat Interaction** (30 seconds)
   - Send: "What are good warm-up exercises?"
   - Show instant FAQ answer
   - Show coin animation
   - Show suggested questions

4. **Personality Adaptation** (20 seconds)
   - Ask motivational question
   - Show supportive response matching personality

5. **Safety Refusal** (15 seconds)
   - Ask: "I have back pain, what medicine?"
   - Show polite refusal
   - Show suggestion to see doctor

6. **Chat History** (15 seconds)
   - Click history icon
   - Show list of conversations
   - Navigate back

7. **Coin System** (10 seconds)
   - Show coin counter
   - Send messages
   - Show coins accumulating

**Total: ~2 minutes**

---

## ✅ Pre-Submission Checklist

### Code Quality
- [ ] No console.log statements in production code
- [ ] No commented-out code blocks
- [ ] No unused imports
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed

### Functionality
- [ ] All features working on iOS
- [ ] All features working on Android
- [ ] Backend API responding
- [ ] Database storing data correctly
- [ ] Grok API integrated and working

### Documentation
- [ ] README.md updated
- [ ] API endpoints documented
- [ ] Installation steps clear
- [ ] Environment variables documented
- [ ] AI_README.md has tool/prompt info

### Bonus Features
- [ ] Coin system working
- [ ] RAG-lite FAQ functional
- [ ] Chat history accessible
- [ ] Theming consistent
- [ ] Animations smooth

### Safety
- [ ] Medical keywords trigger refusals
- [ ] Safety messages are clear
- [ ] Professional recommendations provided

### Demo
- [ ] Video recorded (2-5 minutes)
- [ ] Shows all required features
- [ ] Shows bonus features
- [ ] Audio is clear
- [ ] Screen is visible

---

## 🚀 Final Testing Commands

```bash
# Clean build
npm run reset-project # If issues
npx expo start -c      # Clear cache

# Full test
cd backend && npm run dev &
cd .. && npx expo start

# Check all services
curl http://localhost:3000/health
# Expected: {"status":"ok","message":"Fitness Chatbot API is running"}
```

---

## 📞 Troubleshooting Contacts

### Common Error Messages:

**"Backend server is not running"**
→ Start backend: `cd backend && npm run dev`

**"Invalid Grok API key"**
→ Check .env file in backend/

**"User not found"**
→ Clear AsyncStorage and restart app

**"Failed to fetch chat history"**
→ Check MongoDB is running

**"Network request failed"**
→ Check API_BASE_URL in frontend

---

*Happy Testing! 🎉*
