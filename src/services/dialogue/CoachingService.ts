
import { openAIService } from "@/services/ai/openAIService";

export interface CoachingConfig {
  minScoreThreshold: number;
  minExchangeNumber: number;
}

export class CoachingService {
  private static defaultConfig: CoachingConfig = {
    minScoreThreshold: 2.5,
    minExchangeNumber: 1
  };

  static shouldTriggerIntervention(
    exchangeNumber: number,
    scores: { empathy_score: number; clarity_score: number; inclusion_score: number },
    config: CoachingConfig = this.defaultConfig
  ): boolean {
    const avgScore = (scores.empathy_score + scores.clarity_score + scores.inclusion_score) / 3;
    
    // More thoughtful intervention timing - focus on meaningful moments
    const shouldIntervene = avgScore < config.minScoreThreshold && exchangeNumber > config.minExchangeNumber;
    
    // Also consider providing positive coaching at mid-conversation for encouragement
    const midConversationBoost = exchangeNumber === 3 && avgScore >= 3.5;
    
    return shouldIntervene || midConversationBoost;
  }

  static async generateInterventionContent(
    scores: { empathy_score: number; clarity_score: number; inclusion_score: number },
    exchangeNumber: number,
    scenarioTitle: string
  ): Promise<string> {
    try {
      return await openAIService.generateCoachingIntervention(
        scores,
        exchangeNumber,
        scenarioTitle
      );
    } catch (error) {
      console.error('Error generating coaching intervention:', error);
      
      const avgScore = this.calculateAverageScore(scores);
      
      // More conversational fallback messages
      if (avgScore >= 3.5) {
        return "You're connecting well! Keep building on that authentic engagement in your next response.";
      } else if (scores.empathy_score < 2.5) {
        return "Try tuning into what they're really feeling right now. What might help them feel more heard?";
      } else if (scores.clarity_score < 2.5) {
        return "Consider being more direct about what you're thinking. Sometimes clearer communication helps build trust.";
      } else {
        return "Take a moment to consider their perspective. How can you make space for their voice in this conversation?";
      }
    }
  }

  static calculateAverageScore(scores: { empathy_score: number; clarity_score: number; inclusion_score: number }): number {
    return (scores.empathy_score + scores.clarity_score + scores.inclusion_score) / 3;
  }
}
