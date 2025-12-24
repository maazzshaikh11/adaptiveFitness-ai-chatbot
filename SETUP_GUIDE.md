# Quick Setup Guide

Follow these steps to get the Adaptive Fitness Chatbot running on your machine.

## Prerequisites Checklist

- [ ] Node.js 20.x installed (`node --version`)
- [ ] MongoDB installed and running (`mongod --version`)
- [ ] OpenAI API key (get from https://platform.openai.com/api-keys)
- [ ] iOS Simulator or Android Emulator (or Expo Go app on your phone)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB
mongod

# MongoDB will run on mongodb://localhost:27017
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Use it in backend/.env

### 3. Configure Backend

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

Add your actual values:
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
OPENAI_MODEL=gpt-4
DATABASE_URL=mongodb://localhost:27017/fitness-chatbot
PORT=3000
NODE_ENV=development
```

### 4. Configure Frontend

```bash
# Go back to root directory
cd ..

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

Add:
```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Important for Physical Device Testing:**
If testing on a physical device via Expo Go:
```env
# Replace localhost with your computer's local IP
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:3000
```

To find your IP:
- Mac: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- Windows: `ipconfig`
- Linux: `ip addr show`

### 5. Start the Backend Server

```bash
cd backend
npm start

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on http://localhost:3000
```

Keep this terminal open!

### 6. Start the Frontend App

Open a new terminal:

```bash
# In the project root directory
npm start

# Expo DevTools will open
```

### 7. Run on Device/Simulator

**iOS Simulator:**
```bash
Press 'i' in the Expo terminal
```

**Android Emulator:**
```bash
Press 'a' in the Expo terminal
```

**Physical Device (Expo Go):**
1. Install Expo Go app from App Store/Play Store
2. Scan the QR code shown in terminal
3. Make sure your phone and computer are on the same WiFi network

## Verification Steps

### 1. Check Backend Health
```bash
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","message":"Fitness Chatbot API is running"}
```

### 2. Test in App
1. Open the app
2. Select a personality type
3. Tap "Start Chat"
4. Send a test message: "Create a beginner workout plan"
5. You should receive an AI response

### 3. Test Safety Refusal
Send: "I injured my knee, what should I do?"
Expected: Refusal message directing to healthcare professional

## Common Issues & Solutions

### Issue 1: Backend won't start
```
Error: MongoError: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB if not running
mongod
```

### Issue 2: OpenAI API Error
```
Error: Invalid API key
```
**Solution**: 
1. Check your API key in `backend/.env`
2. Verify it's a valid key from https://platform.openai.com/api-keys
3. Make sure there are no extra spaces or quotes

### Issue 3: Cannot connect to backend from app
```
Error: Failed to send message
```
**Solution**:
1. Check backend is running (`curl http://localhost:3000/health`)
2. If on physical device, use local IP instead of localhost in `.env`
3. Check firewall settings

### Issue 4: Expo install issues
```
Error: Cannot find module 'expo'
```
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### Issue 5: AsyncStorage issues
```
Error: @react-native-async-storage/async-storage
```
**Solution**:
```bash
npx expo install @react-native-async-storage/async-storage
```

## Development Tips

### Backend Development
```bash
# Use nodemon for auto-restart
cd backend
npm run dev
```

### View Backend Logs
Backend logs will show:
- Incoming requests
- OpenAI API calls
- Database operations
- Errors

### Clear App Data (for testing)
```bash
# Expo Go app: Settings → Clear Data

# Or programmatically:
# In app code:
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

### MongoDB GUI Tools
- MongoDB Compass (https://www.mongodb.com/products/compass)
- Studio 3T (https://studio3t.com/)

## Testing Checklist

- [ ] Backend health check responds
- [ ] Can select personality type
- [ ] Can send chat messages
- [ ] AI responses are received
- [ ] Coins increment after each message
- [ ] Safety refusal works for medical queries
- [ ] Quick action buttons work
- [ ] Chat history persists

## Production Considerations

Before deploying to production:

1. **Environment Variables**: Use proper secrets management
2. **Database**: Use MongoDB Atlas or similar
3. **API Keys**: Implement API key rotation
4. **Rate Limiting**: Add rate limits to prevent abuse
5. **Error Tracking**: Implement Sentry or similar
6. **Monitoring**: Add health checks and logging
7. **HTTPS**: Use HTTPS for API communication
8. **Authentication**: Add proper user authentication

## Need Help?

Common resources:
- Expo Documentation: https://docs.expo.dev
- MongoDB Documentation: https://docs.mongodb.com
- OpenAI API Documentation: https://platform.openai.com/docs
- React Native Documentation: https://reactnative.dev

## Next Steps

After successful setup:
1. Review `README.md` for architecture details
2. Check `AI_README.md` for AI tool usage
3. Explore personality types
4. Test different fitness queries
5. Verify safety mechanisms

---

Happy Coding! 💪🚀
