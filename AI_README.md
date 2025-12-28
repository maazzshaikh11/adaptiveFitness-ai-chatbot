# AI Usage Disclosure

This project uses Generative AI as part of the assignment requirements.

## Tool Used
- **OpenAI API (GPT-based models)**

No other generative AI tools were used in this project.

## Purpose of AI Usage
The AI model is used to generate fitness-related conversational responses, including:
- Workout plans
- General fitness tips
- Motivation and encouragement
- Wellness guidance (non-medical only)

## Prompt Strategy Overview

The AI is prompted using a structured system prompt that combines multiple layers of context.

### 1. Safety Rules
- The AI is instructed NOT to provide medical advice
- It must refuse queries related to injuries, diseases, medications, or supplements
- It suggests consulting certified healthcare professionals for medical concerns

### 2. Personality-Based Adaptation
The system prompt adapts responses based on the selected user personality:
- **Encouragement Seeker** – supportive, motivational tone
- **Creative Explorer** – creative, engaging suggestions
- **Goal Finisher** – structured plans and clear milestones

### 3. Usage Duration Context
The prompt adjusts tone and guidance based on how long the user has been using the app:
- **Days 0–3**: Empathetic, listening-focused
- **Days 4–8**: Balanced suggestions
- **Days 9+**: More directive, coach-like guidance

### 4. Lifestyle Context
The following user data is included in every AI request:
- Daily steps
- Exercise minutes
- Sleep hours

This context is used to personalize responses (e.g., encouraging walking if steps are low or emphasizing recovery if sleep is insufficient).

## Example Prompt Structure (Simplified)

```text
You are an adaptive AI fitness companion.

Rules:
- You are not a medical professional
- Do not provide medical advice

User Personality: Encouragement Seeker
Days Using App: 5
Lifestyle Data:
- Steps: 3000
- Exercise Minutes: 15
- Sleep Hours: 5.5

Based on this context, provide safe, supportive, and personalized fitness guidance.
