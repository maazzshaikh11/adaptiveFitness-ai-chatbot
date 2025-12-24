# Grok API Migration Guide

## ✅ Changes Made

This project has been migrated from OpenAI API to **Grok API (X.AI)**.

### Files Changed

1. **`backend/services/grokService.js`** (NEW)
   - Created Grok-compatible service
   - Uses `axios` instead of OpenAI SDK
   - Maintains all the same functionality (personality, usage duration, lifestyle data)

2. **`backend/server.js`**
   - Changed import from `openaiService` to `grokService`

3. **`backend/.env.example`**
   - Updated with Grok API configuration
   - Added `GROK_API_KEY`, `GROK_BASE_URL`, `GROK_MODEL`

4. **`backend/package.json`**
   - Replaced `openai` package with `axios`
   - Removed OpenAI SDK dependency

---

## 🚀 Setup Instructions

### 1. Get Grok API Key

Sign up at: **https://console.x.ai** or **https://x.ai**

### 2. Create `.env` file in `backend/` directory

```bash
cd backend
cp .env.example .env
```

### 3. Update `.env` with your Grok API key

```env
GROK_API_KEY=your_actual_grok_api_key_here
GROK_BASE_URL=https://api.x.ai/v1
GROK_MODEL=grok-beta
DATABASE_URL=mongodb://localhost:27017/fitness-chatbot
PORT=3000
NODE_ENV=development
```

### 4. Install dependencies

```bash
cd backend
npm install
```

This will install `axios` and remove the old `openai` package.

### 5. Start the backend server

```bash
npm run dev
# or
npm start
```

---

## 🔄 What Stayed the Same

✅ All functionality remains identical:
- Personality-based behavior
- Usage duration adaptation
- Lifestyle context integration
- Safety guardrails (medical content refusal)
- Prompt composition strategy
- Database operations
- API endpoints

✅ Frontend code requires **NO CHANGES**
- React Native app continues to work as-is
- API calls to backend remain unchanged

---

## 📊 API Comparison

| Feature | OpenAI | Grok (X.AI) |
|---------|--------|-------------|
| **Base URL** | `https://api.openai.com/v1` | `https://api.x.ai/v1` |
| **SDK** | `openai` npm package | `axios` (REST API) |
| **Models** | `gpt-4`, `gpt-3.5-turbo` | `grok-beta`, `grok-2-latest` |
| **Message Format** | OpenAI format | Same (compatible) |
| **Rate Limits** | Based on tier | Check X.AI docs |
| **Free Tier** | Limited | Available |

---

## 🧪 Testing the Migration

Test the chat endpoint:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "message": "Create a beginner workout plan for 3 days a week"
  }'
```

Expected response:
```json
{
  "response": "...(structured workout plan)...",
  "isSafetyRefusal": false,
  "coins": 1,
  "daysUsing": 0
}
```

---

## ⚠️ Important Notes

1. **Grok API uses OpenAI-compatible format** - minimal code changes needed
2. **Keep the old `openaiService.js`** - in case you want to switch back
3. **Rate limits may differ** - monitor your usage
4. **Error handling** - Grok-specific error codes are handled in `grokService.js`

---

## 🐛 Troubleshooting

### Error: "Invalid Grok API key"
- Check your `.env` file
- Verify API key at https://console.x.ai

### Error: "Rate limit exceeded"
- Wait a few minutes
- Check your Grok API usage limits

### Error: "Module not found: axios"
- Run `npm install` in the backend directory

---

## 📝 Documentation Update

Remember to update your `README.md` to mention:
- Project uses **Grok API (X.AI)** instead of OpenAI
- Model: `grok-beta`
- Free tier available

---

## 🔙 Rolling Back (if needed)

To switch back to OpenAI:

1. Change `server.js` import back:
   ```javascript
   const { generateChatResponse } = require('./services/openaiService');
   ```

2. Update `.env`:
   ```env
   OPENAI_API_KEY=your_key
   OPENAI_MODEL=gpt-4
   ```

3. Reinstall OpenAI SDK:
   ```bash
   npm install openai
   ```

---

## ✅ Next Steps

1. ✅ Backend migrated to Grok API
2. ⏭️ Test all personality types
3. ⏭️ Test usage duration adaptation
4. ⏭️ Test safety guardrails
5. ⏭️ Update README.md with Grok API info
6. ⏭️ Record demo video showing Grok integration
