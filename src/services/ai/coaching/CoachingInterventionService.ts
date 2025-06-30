
import { baseOpenAIService } from "../core/BaseOpenAIService";

class CoachingInterventionService {
  async generateCoachingIntervention(scores: any, exchangeNumber: number, scenarioTitle: string) {
    const systemMessage = `You are a supportive leadership coach providing conversational, encouraging guidance that helps leaders improve their dialogue skills naturally.`;

    const prompt = `The user is engaged in a leadership conversation simulation: "${scenarioTitle}"

CURRENT EXCHANGE: #${exchangeNumber}
RECENT SCORES: Empathy ${scores.empathy_score}/5, Clarity ${scores.clarity_score}/5, Inclusion ${scores.inclusion_score}/5

Provide warm, conversational coaching that feels natural and supportive. Instead of formal advice, offer 1-2 sentences that feel like a supportive colleague sharing insight. Focus on what they can try in their next response to deepen the authentic connection with the other person.

Keep it encouraging, specific, and conversational - as if you're coaching a friend through a real conversation.`;

    try {
      return await baseOpenAIService.generateCompletion(prompt, systemMessage, 0.7);
    } catch (error) {
      console.error('Error generating coaching intervention:', error);
      return "Take a moment to really listen to what they're sharing. How might you respond in a way that shows you truly understand their perspective?";
    }
  }
}

export const coachingInterventionService = new CoachingInterventionService();
