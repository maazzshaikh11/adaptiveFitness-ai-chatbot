export type PersonalityType = 'encouragement_seeker' | 'creative_explorer' | 'goal_finisher';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'workout_plan' | 'tips';
}


export interface LifestyleData {
  steps: number;
  exerciseMinutes: number;
  sleepHours: number;
}

export interface User {
  userId: string;
  personality: PersonalityType;
  coins: number;
  lifestyleData: LifestyleData;
  firstUsedAt: Date;
}

export interface ChatResponse {
  response: string;
  isSafetyRefusal: boolean;
  coins: number;
  daysUsing: number;
}

export interface PersonalityOption {
  id: PersonalityType;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  color: string;
}
