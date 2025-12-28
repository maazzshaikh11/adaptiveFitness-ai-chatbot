Perfect — here’s a **fully updated, recruiter-ready README.md**, aligned **line-by-line with the assignment**, clean, professional, and submission-safe.
You can **replace your current README completely with this** 👇

---

# 🏋️ Adaptive Fitness Companion Chatbot

**(React Native + OpenAI API)**

An AI-powered, mobile-first fitness chatbot built with **React Native (Expo)** and **Node.js**, designed to deliver **personalized, adaptive coaching** based on user personality, app usage duration, and basic lifestyle context.

🔗 **Live Frontend:** [https://adaptive-fitness-rprr.vercel.app](https://adaptive-fitness-rprr.vercel.app)
🔗 **Live Backend:** [https://adaptive-fitness-bay.vercel.app](https://adaptive-fitness-bay.vercel.app)

---

## 🚀 Overview

Adaptive Fitness Companion is an intelligent fitness chatbot that simulates a real personal coach.
Instead of giving generic answers, the chatbot **adapts its tone, structure, and guidance dynamically** using:

* User personality type
* App usage duration
* Lifestyle data (steps, exercise time, sleep hours)

⚠️ **Important:** This app is **not a medical tool** and strictly avoids medical advice.

---

## ✅ Assignment Alignment

This project was built **strictly according to the assignment requirements**, including:

* Expo **Managed Workflow only** (no eject)
* Node.js **v20.x (LTS)** backend using Express
* MongoDB database for chat history
* Adaptive AI behavior using:

  * Personality
  * Usage duration
  * Lifestyle context
* Safety guardrails preventing medical advice
* Structured AI responses (cards, lists, quick actions)

---

## ✨ Key Features

### 🤖 Adaptive AI Coaching (Core Feature)

The chatbot supports **three predefined personalities**:

* **Encouragement Seeker**
  Motivational, supportive, reassurance-focused responses

* **Creative Explorer**
  Engaging, creative, non-repetitive suggestions

* **Goal Finisher**
  Structured plans, clear steps, and milestones

Personality can be selected during onboarding or preset for demo purposes.

---

### ⏱️ Usage Duration–Based Behavior

The AI coaching style changes automatically based on how long the user has been using the app:

| Days Using App | AI Behavior                     |
| -------------- | ------------------------------- |
| 0–3 days       | Empathetic, listening-focused   |
| 4–8 days       | Friendly, balanced suggestions  |
| 9+ days        | Coach-like, actionable guidance |

---

### 🧠 Lifestyle Context Awareness

The chatbot considers **dummy lifestyle data**:

```json
{
  "steps": 4200,
  "exerciseMinutes": 25,
  "sleepHours": 5.5
}
```

This data is injected into every AI prompt to personalize responses (e.g., encouraging walking if steps are low or rest if sleep is insufficient).

---

### 📋 Structured AI Responses

AI responses are **never plain text blobs**. The app supports:

* ✅ Day-wise workout plans (card layout)
* ✅ Bullet-point fitness tips
* ✅ Follow-up quick action pills (e.g., *Beginner Plan*, *Warm-up*)

---

### 🛡️ Safety & Scope Guardrails

The chatbot **politely refuses** to answer questions related to:

* Diseases (e.g., diabetes, heart conditions)
* Injuries (e.g., fractures, ligament tears)
* Medications or supplements

In such cases, it:

* Clearly states it cannot provide medical advice
* Suggests consulting certified healthcare professionals

This is enforced via:

* Keyword-based checks
* System-level AI prompt rules

---

### 🎮 Gamification

* Users earn **1 coin per message**
* Coin animation provides subtle engagement feedback

---

## 🛠️ Tech Stack

### Frontend

* React Native (Expo – Managed Workflow)
* Expo Router
* AsyncStorage

### Backend

* Node.js
* Express
* MongoDB (Atlas)

### AI

* **OpenAI API (GPT-based models)**

### Deployment

* Frontend: Vercel
* Backend: Vercel (Serverless APIs)
* Mobile Build: Expo EAS (Android)

---

## 📱 Running the App Locally

### 1. Clone the repository

```bash
git clone https://github.com/maazzshaikh11/adaptiveFitness-ai-chatbot.git
cd adaptiveFitness-ai-chatbot
```

### 2. Install dependencies

```bash
npm install
cd backend && npm install && cd ..
```

### 3. Environment Variables

**Backend (`backend/.env`)**

```env
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_mongodb_url
PORT=3000
```

**Frontend (`.env`)**

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 4. Start the project

```bash
# Backend
cd backend
npm start

# Frontend
npm start
```

Scan the QR code using **Expo Go** to run on a mobile device.

---

## 🧩 Architecture Highlights

* Clean separation of frontend and backend concerns
* Modular prompt composition using:

  * Safety rules
  * Personality context
  * Usage duration logic
  * Lifestyle data
* Structured response parsing for better UI/UX
* Scalable and readable component architecture

---

## 🤖 AI Usage Disclosure (Mandatory – Section 9.7)

**AI Tool Used:** OpenAI API (GPT-based models)

The AI is used exclusively to generate:

* Workout plans
* Fitness tips
* Motivation and coaching responses
* General wellness guidance (non-medical)

### Prompt Composition Strategy

Each AI request combines:

* User personality
* App usage duration behavior
* Lifestyle data (steps, exercise, sleep)
* Safety instructions
* User’s question

Detailed prompt rules and examples are documented in **`AI_README.md`**.

---

## 🎥 Demo Video

A **2–5 minute screen-recorded demo** is provided, showcasing:

* Welcome screen
* Chat interactions
* Personality-based responses
* Usage-duration adaptation
* Structured AI responses
* Safety refusal examples

---

## 📦 APK Note

The Android APK works with a reachable backend API.
The recommended evaluation methods are:

* Web deployment
* Expo development builds

---

## 🔮 Future Enhancements

* Wearable integrations (Google Fit / Apple Health)
* Progress charts and analytics
* Voice input/output
* Authentication & profiles
* Offline support
* Multi-language support

---

## 📄 License

This project was developed for an assignment and is intended for educational/demo purposes.

---

## 👨‍💻 Author

**Muaz Shaikh**
Software Engineering Student | Full-Stack & Mobile Development

