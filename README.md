# 🏋️ Adaptive Fitness Companion Chatbot

An AI-powered fitness chatbot built with **React Native (Expo)** and **Node.js**, designed to deliver **personalized coaching** based on user personality, activity data, and usage patterns.

🔗 **Live Frontend:** [https://adaptive-fitness-rprr.vercel.app](https://adaptive-fitness-rprr.vercel.app)
🔗 **Live Backend:** [https://adaptive-fitness-bay.vercel.app](https://adaptive-fitness-bay.vercel.app)

---

## 🚀 Overview

Adaptive Fitness Companion is a mobile-first AI chatbot that adapts its coaching style dynamically using:

* User personality type
* App usage duration
* Lifestyle data (steps, exercise time, sleep)

The goal is to simulate a **real fitness coach**—motivational, structured, or creative—depending on the user.

---

## ✨ Key Features

### 🤖 Adaptive AI Coaching

* **Encouragement Seeker** → Motivational & positive
* **Creative Explorer** → Variety-driven, engaging responses
* **Goal Finisher** → Structured plans & milestones

### 🧠 Context-Aware Responses

* Coaching style changes over time (new vs. long-term users)
* Uses lifestyle data to tailor suggestions

### 🛡️ Safety Guardrails

* Automatically detects and refuses:

  * Medical advice
  * Injury treatment
  * Medication or supplement guidance

### 📋 Structured AI Responses

* Day-wise workout plans (card layout)
* Bullet-point fitness tips
* Quick action suggestion pills

### 🎮 Gamification

* Coin reward system (1 coin per message)
* Encourages consistent engagement

---

## 🛠️ Tech Stack

**Frontend**

* React Native (Expo)
* Expo Router
* AsyncStorage

**Backend**

* Node.js
* Express
* MongoDB (Atlas)

**AI**

* OpenAI API (GPT-based)

**Deployment**

* Frontend: Vercel
* Backend: Vercel (Serverless APIs)
* Mobile Build: Expo EAS (Android APK)

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

### 3. Environment variables

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

Scan the QR using **Expo Go** to run on mobile.

---

## 🧩 Architecture Highlights

* Modular backend with clear separation of concerns
* AI prompt composition based on:

  * Safety rules
  * Personality
  * Usage duration
  * Lifestyle data
* Structured response parsing for improved UX
* Clean component-based UI

---

## ⚠️ APK Note

The Android APK requires a reachable backend API.

* The app works fully via:

  * Web deployment
  * Expo development builds
* For production-grade APKs, a persistent backend platform (e.g., Render/Railway) is recommended.

---

## 🔮 Future Improvements

* Wearable integrations (Google Fit / Apple Health)
* Progress charts & analytics
* Voice-based interaction
* Authentication & user profiles
* Offline support
* Multi-language support

---

## 📄 License

This project was developed as part of a technical assignment and is intended for educational/demo purposes.

---

## 👨‍💻 Author

**Muaz Shaikh**
Software Engineering Student | Full-Stack & Mobile Development

