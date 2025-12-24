/**
 * Response Parser Service
 * Extracts structured content from AI responses
 */

interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
}

interface DayPlan {
  day: string;
  focus?: string;
  exercises: Exercise[];
  notes?: string;
}

interface ParsedResponse {
  type: 'text' | 'workout_plan' | 'tips_list' | 'mixed';
  text: string;
  workoutPlans?: DayPlan[];
  tipsList?: {
    title?: string;
    tips: string[];
  };
}

/**
 * Parse workout plans from AI response
 * Looks for day-wise workout patterns
 */
export function parseWorkoutPlan(text: string): DayPlan[] | null {
  const plans: DayPlan[] = [];
  
  // Enhanced patterns to match various formats:
  // 1. "**Monday: Chest and Triceps**"
  // 2. "Day 1 - Upper Body"
  // 3. "Monday - Leg Day"
  // 4. "Day 1: Chest"
  const dayPattern = /(?:^|\n)(?:\*{0,2})(?:Day\s+\d+|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(?:\s*[-:]\s*([^\n*]+))?(?:\*{0,2})[:\n]/gi;
  
  // Find all day headers
  let matches = [];
  let match;
  const regex = new RegExp(dayPattern);
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      fullMatch: match[0],
      index: match.index,
      focus: match[1]
    });
  }
  
  if (matches.length < 1) {
    return null; // Not a workout plan
  }
  
  // Extract content for each day
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    
    // Get day name and focus
    const dayHeader = currentMatch.fullMatch.replace(/[\*:\n]/g, '').trim();
    const dayName = dayHeader.split(/[-:]/)[0].trim();
    const focus = currentMatch.focus ? currentMatch.focus.trim() : undefined;
    
    // Extract content between this day and next day (or end of text)
    const startIndex = currentMatch.index + currentMatch.fullMatch.length;
    const endIndex = nextMatch ? nextMatch.index : text.length;
    const dayContent = text.substring(startIndex, endIndex);
    
    // Extract exercises
    const exercises = parseExercises(dayContent);
    
    // Extract notes (usually at the end)
    const notesMatch = dayContent.match(/(?:note|tip|remember|cool-down)[:\s]*([^\n]+)/i);
    const notes = notesMatch ? notesMatch[1].trim() : undefined;
    
    if (exercises.length > 0) {
      plans.push({
        day: dayName,
        focus,
        exercises,
        notes,
      });
    }
  }
  
  return plans.length > 0 ? plans : null;
}

/**
 * Parse exercises from text
 */
function parseExercises(text: string): Exercise[] {
  const exercises: Exercise[] = [];
  
  // Pattern: numbered list or bullet points with exercise details
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3) continue;
    
    // Skip day headers and notes
    if (trimmed.match(/^\*{0,2}(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Day\s+\d+)/i)) continue;
    if (trimmed.match(/^(?:note|tip|remember|cool-down):/i)) continue;
    
    // Match: "* Push-ups - 3 sets x 15 reps"
    // Or: "* Warm-up: 5-10 minutes of light cardio"
    // Or: "1. Squats: 4 sets of 12 reps"
    const exerciseMatch = trimmed.match(/^(?:\d+\.|\*|\-|\•)\s*(.+)/);
    
    if (exerciseMatch) {
      const content = exerciseMatch[1].trim();
      const exercise = parseExerciseDetails(content);
      if (exercise) {
        exercises.push(exercise);
      }
    }
  }
  
  return exercises;
}

/**
 * Parse individual exercise details
 */
function parseExerciseDetails(text: string): Exercise | null {
  // Extract name (before - or : or ( )
  const nameMatch = text.match(/^([^-:(]+)/);
  if (!nameMatch) return null;
  
  const name = nameMatch[1].trim();
  if (name.length < 2) return null;
  
  const exercise: Exercise = { name };
  
  // Extract sets - various patterns:
  // "3 sets x 12 reps"
  // "3 sets of 12 reps"
  // "4 sets"
  const setsMatch = text.match(/(\d+)\s*sets?/i);
  if (setsMatch) {
    exercise.sets = setsMatch[1];
  }
  
  // Extract reps - various patterns:
  // "x 15 reps"
  // "of 12 reps"
  // "12 reps"
  // "8-12 reps"
  const repsMatch = text.match(/(?:x|of)?\s*(\d+(?:-\d+)?)\s*reps?/i);
  if (repsMatch) {
    exercise.reps = repsMatch[1];
  }
  
  // Extract duration - various patterns:
  // "30 seconds"
  // "5-10 minutes"
  // "1 minute"
  const durationMatch = text.match(/(\d+(?:-\d+)?)\s*(?:seconds?|mins?|minutes?)/i);
  if (durationMatch) {
    exercise.duration = durationMatch[0];
  }
  
  // Extract notes (text in parentheses or after "Note:")
  const notesMatch = text.match(/\(([^)]+)\)|note:\s*(.+)/i);
  if (notesMatch) {
    exercise.notes = (notesMatch[1] || notesMatch[2]).trim();
  }
  
  return exercise;
}

/**
 * Parse tips list from AI response
 */
export function parseTipsList(text: string): { title?: string; tips: string[] } | null {
  // Look for patterns like "Top 5 tips:", "Here are tips:", etc.
  const titleMatch = text.match(/(?:^|\n)((?:top\s+\d+\s+)?tips?[^\n:]*)[:\n]/i);
  const title = titleMatch ? titleMatch[1].trim() : undefined;
  
  // Extract bullet points or numbered items
  const tips: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match: "1. Tip text" or "- Tip text" or "• Tip text"
    const tipMatch = trimmed.match(/^(?:\d+\.|\-|\•|\*)\s*(.+)/);
    
    if (tipMatch) {
      const tip = tipMatch[1].trim();
      if (tip.length > 5) {
        tips.push(tip);
      }
    }
  }
  
  // Only return if we found multiple tips (2+)
  return tips.length >= 2 ? { title, tips } : null;
}

/**
 * Main parsing function
 * Determines response type and extracts structured content
 */
export function parseAIResponse(text: string): ParsedResponse {
  console.log('[Parser] Parsing response, length:', text.length);
  
  // Try to parse workout plan
  const workoutPlans = parseWorkoutPlan(text);
  
  if (workoutPlans && workoutPlans.length > 0) {
    console.log('[Parser] Found workout plan with', workoutPlans.length, 'days');
    return {
      type: 'workout_plan',
      text,
      workoutPlans,
    };
  }
  
  // Try to parse tips list
  const tipsList = parseTipsList(text);
  
  if (tipsList && tipsList.tips.length > 0) {
    console.log('[Parser] Found tips list with', tipsList.tips.length, 'tips');
    return {
      type: 'tips_list',
      text,
      tipsList,
    };
  }
  
  console.log('[Parser] No structured content found, returning plain text');
  // Default to plain text
  return {
    type: 'text',
    text,
  };
}

/**
 * Check if text contains structured content
 */
export function hasStructuredContent(text: string): boolean {
  const parsed = parseAIResponse(text);
  return parsed.type !== 'text';
}
