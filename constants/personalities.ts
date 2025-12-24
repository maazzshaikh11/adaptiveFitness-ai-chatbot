import { PersonalityOption } from '@/types';

export const PERSONALITIES: PersonalityOption[] = [
  {
    id: 'encouragement_seeker',
    title: 'Encouragement Seeker',
    description: 'I need motivation and positive reinforcement to stay on track',
    traits: [
      '💪 Loves positive reinforcement',
      '🎯 Needs frequent encouragement',
      '✨ Celebrates small wins',
      '🌟 Thrives on support'
    ],
    icon: '💖',
    color: '#FF6B9D'
  },
  {
    id: 'creative_explorer',
    title: 'Creative Explorer',
    description: 'I prefer variety and creative approaches to fitness',
    traits: [
      '🎨 Loves variety and creativity',
      '🌈 Prefers diverse workouts',
      '💡 Enjoys new ideas',
      '🔄 Dislikes repetition'
    ],
    icon: '🎨',
    color: '#4ECDC4'
  },
  {
    id: 'goal_finisher',
    title: 'Goal Finisher',
    description: 'I want structured plans and clear milestones',
    traits: [
      '📋 Loves structured plans',
      '✅ Goal-oriented mindset',
      '📊 Tracks progress actively',
      '🎯 Focused on results'
    ],
    icon: '🎯',
    color: '#95E1D3'
  }
];

export const FITNESS_FAQS = [
  {
    question: 'What are the best exercises for beginners?',
    answer: 'Start with bodyweight exercises like squats, push-ups, planks, and walking. These build foundational strength without equipment.'
  },
  {
    question: 'How often should I work out?',
    answer: 'Aim for 3-5 days per week with rest days in between. Consistency matters more than intensity when starting out.'
  },
  {
    question: 'What should I eat before a workout?',
    answer: 'Have a light meal with carbs and protein 1-2 hours before. Examples: banana with peanut butter, oatmeal, or a small smoothie.'
  },
  {
    question: 'How do I stay motivated?',
    answer: 'Set realistic goals, track progress, find a workout buddy, and celebrate small wins. Make fitness enjoyable, not a chore.'
  },
  {
    question: 'What are good warm-up exercises?',
    answer: 'Dynamic stretches, light cardio (5-10 min), arm circles, leg swings, and mobility work prepare your body for exercise.'
  },
  {
    question: 'How much water should I drink?',
    answer: 'Aim for 8-10 glasses daily, more if exercising. Drink before, during, and after workouts to stay hydrated.'
  },
  {
    question: 'How important is sleep for fitness?',
    answer: '7-9 hours is crucial. Sleep aids muscle recovery, hormone regulation, and energy levels for workouts.'
  },
  {
    question: 'Can I work out every day?',
    answer: 'You can do light activity daily, but intense workouts need rest days. Listen to your body and avoid overtraining.'
  },
  {
    question: 'What\'s the best time to work out?',
    answer: 'The best time is when you\'ll be consistent. Morning, afternoon, or evening - choose what fits your schedule and energy levels.'
  },
  {
    question: 'How do I prevent muscle soreness?',
    answer: 'Proper warm-up, gradual progression, stretching, adequate hydration, and rest help minimize soreness.'
  }
];

export const QUICK_ACTION_SUGGESTIONS = [
  '🏃‍♂️ Beginner workout plan',
  '🔥 Quick warm-up routine',
  '💪 Strength training tips',
  '🧘‍♀️ Flexibility exercises',
  '🎯 Stay motivated',
  '🥗 Pre-workout nutrition',
  '💤 Sleep and recovery',
  '📊 Track my progress'
];
