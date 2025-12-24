import { FITNESS_FAQS } from '@/constants/personalities';

/**
 * RAG-lite service for fitness FAQ
 * Searches local FAQ data to enrich prompts
 */

interface FAQMatch {
  question: string;
  answer: string;
  relevanceScore: number;
}

/**
 * Calculate similarity between two strings (simple keyword matching)
 */
function calculateRelevance(query: string, faqQuestion: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const faqWords = faqQuestion.toLowerCase().split(/\s+/);
  
  let matches = 0;
  for (const word of queryWords) {
    if (word.length < 3) continue; // Skip short words
    
    for (const faqWord of faqWords) {
      if (faqWord.includes(word) || word.includes(faqWord)) {
        matches++;
        break;
      }
    }
  }
  
  return matches / queryWords.length;
}

/**
 * Search FAQs for relevant answers
 */
export function searchFAQ(query: string, threshold: number = 0.2): FAQMatch[] {
  const matches: FAQMatch[] = [];
  
  for (const faq of FITNESS_FAQS) {
    const relevanceScore = calculateRelevance(query, faq.question);
    
    if (relevanceScore >= threshold) {
      matches.push({
        question: faq.question,
        answer: faq.answer,
        relevanceScore,
      });
    }
  }
  
  // Sort by relevance score (highest first)
  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get the best FAQ match for a query
 */
export function getBestFAQMatch(query: string): FAQMatch | null {
  const matches = searchFAQ(query, 0.3);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Enrich a user prompt with relevant FAQ context
 * This can be sent to the backend to improve AI responses
 */
export function enrichPromptWithFAQ(userMessage: string): string {
  const relevantFAQs = searchFAQ(userMessage, 0.25).slice(0, 2);
  
  if (relevantFAQs.length === 0) {
    return userMessage;
  }
  
  // Add FAQ context to the message
  let enrichedPrompt = userMessage;
  enrichedPrompt += '\n\n[Relevant FAQ Context]:';
  
  for (const faq of relevantFAQs) {
    enrichedPrompt += `\nQ: ${faq.question}\nA: ${faq.answer}\n`;
  }
  
  return enrichedPrompt;
}

/**
 * Get suggested questions based on user query
 */
export function getSuggestedQuestions(query: string): string[] {
  const matches = searchFAQ(query, 0.2).slice(0, 3);
  return matches.map(m => m.question);
}

/**
 * Check if query matches an FAQ directly
 * Returns FAQ answer if match is strong enough
 */
export function getDirectFAQAnswer(query: string): string | null {
  const bestMatch = getBestFAQMatch(query);
  
  // If relevance is very high (>50%), return FAQ answer directly
  if (bestMatch && bestMatch.relevanceScore > 0.5) {
    return bestMatch.answer;
  }
  
  return null;
}
