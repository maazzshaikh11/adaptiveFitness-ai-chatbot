const axios = require('axios');

// Grok API Configuration
const GROK_API_KEY = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY; // Fallback for compatibility
const GROK_BASE_URL = process.env.GROK_BASE_URL || 'https://api.x.ai/v1';
const GROK_MODEL = process.env.GROK_MODEL || 'grok-beta';

// Safety keywords that should trigger refusal
const MEDICAL_KEYWORDS = [
  'disease', 'diabetes', 'heart disease', 'cancer', 'injury', 'fracture',
  'ligament', 'tear', 'medication', 'medicine', 'drug', 'supplement',
  'pill', 'prescription', 'diagnosis', 'symptom', 'pain', 'chronic'
];

// Check if message contains medical/safety concerns
function containsMedicalContent(message) {
  const lowerMessage = message.toLowerCase();
  return MEDICAL_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

// Generate system prompt based on user context
function generateSystemPrompt(personality, daysUsing, lifestyleData) {
  let basePrompt = `You are an adaptive AI fitness companion. Your role is to provide fitness guidance, workout plans, and wellness tips.

IMPORTANT SAFETY RULES:
- You are NOT a medical professional
- Do NOT provide medical advice about diseases, injuries, or medications
- Do NOT diagnose or treat medical conditions
- If asked about medical concerns, politely refuse and suggest consulting a healthcare professional
- Focus ONLY on general fitness, workouts, and wellness guidance

`;

  // Personality-based behavior
  const personalityPrompts = {
    encouragement_seeker: `USER PERSONALITY: Encouragement Seeker
- This user needs frequent reassurance and positive reinforcement
- They get easily demotivated, so be extra supportive and encouraging
- Celebrate small wins and progress
- Use phrases like "You've got this!", "Great job!", "Every step counts!"
- Break down goals into smaller, achievable milestones
- Provide frequent motivation and acknowledge their efforts
`,
    creative_explorer: `USER PERSONALITY: Creative Explorer
- This user gets easily distracted and prefers variety
- They dislike being spoon-fed information
- Offer creative workout ideas and alternatives
- Present information in engaging, non-repetitive ways
- Encourage exploration of different fitness activities
- Use metaphors, analogies, and interesting facts
- Keep responses dynamic and thought-provoking
`,
    goal_finisher: `USER PERSONALITY: Goal Finisher
- This user is highly motivated and goal-oriented
- They prefer structured plans with clear checkboxes
- Provide detailed, actionable steps
- Use numbered lists, schedules, and clear milestones
- Be direct and efficient in communication
- Focus on measurable progress and achievement
- Include specific targets and deadlines
`
  };

  basePrompt += personalityPrompts[personality] || personalityPrompts.encouragement_seeker;

  // Usage duration-based coaching style
  if (daysUsing <= 3) {
    basePrompt += `\nCOACHING STYLE (Days 0-3):
- Be grounded and empathetic
- Listen more than prescribe
- Allow the user to express concerns and frustrations
- Don't push instant remedies unless explicitly asked
- Build trust through understanding
- Ask clarifying questions before giving advice
`;
  } else if (daysUsing <= 8) {
    basePrompt += `\nCOACHING STYLE (Days 4-8):
- Be a friendly listener with growing familiarity
- After 2 back-and-forth messages, you can offer short remedies
- Balance listening with gentle suggestions
- Show you remember their context
- Offer tips naturally in conversation
`;
  } else {
    basePrompt += `\nCOACHING STYLE (Days 9+):
- Act as an experienced coach
- Provide actionable guidance after 1 message
- Be more directive while remaining supportive
- Assume they trust your expertise
- Focus on optimization and progress
`;
  }

  // Lifestyle context
  basePrompt += `\nUSER'S CURRENT LIFESTYLE DATA:
- Daily Steps: ${lifestyleData.steps}
- Exercise Minutes Today: ${lifestyleData.exerciseMinutes}
- Sleep Last Night: ${lifestyleData.sleepHours} hours

Consider this context when providing advice. For example:
- If steps are low, encourage more walking
- If sleep is insufficient, mention recovery importance
- If exercise is high, acknowledge their effort
`;

  basePrompt += `\nRESPONSE FORMAT:
- Be conversational and natural
- Use structured formats when appropriate (numbered lists, bullet points)
- For workout plans, present in clear day-by-day format
- Include actionable tips and quick suggestions
- Keep responses focused and digestible
`;

  return basePrompt;
}

// Generate refusal message for medical content
function generateRefusalMessage() {
  return {
    response: `I appreciate your question, but I'm not able to provide advice on medical conditions, injuries, or medications. 

As a fitness companion, I'm here to help with:
✓ Workout plans and exercises
✓ Fitness tips and techniques
✓ Motivation and consistency
✓ General wellness guidance

For concerns about injuries, diseases, or medical conditions, I strongly recommend consulting with:
• A licensed physician or healthcare provider
• A certified physical therapist
• A registered sports medicine specialist

Is there a general fitness topic I can help you with instead?`,
    isSafetyRefusal: true
  };
}

async function generateChatResponse(userMessage, personality, daysUsing, lifestyleData, conversationHistory = []) {
  try {
    // Safety check
    if (containsMedicalContent(userMessage)) {
      return generateRefusalMessage();
    }

    // Build messages array
    const systemPrompt = generateSystemPrompt(personality, daysUsing, lifestyleData);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // Call Grok API (OpenAI-compatible endpoint)
    const response = await axios.post(
      `${GROK_BASE_URL}/chat/completions`,
      {
        model: GROK_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    return {
      response: response.data.choices[0].message.content,
      isSafetyRefusal: false
    };
  } catch (error) {
    console.error('Grok API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Invalid Grok API key. Please check your credentials.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        case 500:
          throw new Error('Grok service error. Please try again.');
        default:
          throw new Error('Failed to generate response from Grok API.');
      }
    }
    
    throw new Error('Network error. Please check your connection.');
  }
}

module.exports = {
  generateChatResponse,
  containsMedicalContent,
  generateRefusalMessage
};
