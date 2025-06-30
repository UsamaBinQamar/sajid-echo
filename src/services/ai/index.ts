
import { openAIService } from "./openAIService";
import { contentGenerator } from "./contentGenerator";
import { sentimentAnalyzer } from "./sentimentAnalyzer";
import { behaviorPredictor } from "./behaviorPredictor";
import { intelligentCoach } from "./intelligentCoach";
import { contextualAwareness } from "./contextualAwareness";

export type { 
  AIInsight, 
  ContentRecommendation, 
  BehaviorPrediction,
  CoachingRecommendation,
  ContextualTrigger 
} from "./types";

class AIEngineService {
  // Content generation
  async generatePersonalizedPrompt(userId: string, context?: any) {
    return contentGenerator.generateJournalPrompt(userId, context);
  }

  async generateWellnessContent(userId: string, contentType: string) {
    return contentGenerator.generateWellnessContent(userId, contentType);
  }

  // Sentiment and emotion analysis
  async analyzeJournalEntry(content: string, userId: string) {
    return sentimentAnalyzer.analyzeJournalEntry(content, userId);
  }

  async extractInsights(userId: string, timeframe: number = 7) {
    return sentimentAnalyzer.extractInsights(userId, timeframe);
  }

  // Behavioral predictions
  async predictUserBehavior(userId: string, predictionType: string) {
    return behaviorPredictor.predictBehavior(userId, predictionType);
  }

  async identifyRiskPatterns(userId: string) {
    return behaviorPredictor.identifyRiskPatterns(userId);
  }

  // Intelligent coaching
  async getCoachingRecommendation(userId: string, context?: any) {
    return intelligentCoach.getPersonalizedCoaching(userId, context);
  }

  async generateInterventions(userId: string, riskLevel: string) {
    return intelligentCoach.generateInterventions(userId, riskLevel);
  }

  // Contextual awareness
  async getContextualRecommendations(userId: string) {
    return contextualAwareness.getRecommendations(userId);
  }

  async optimizeNotificationTiming(userId: string) {
    return contextualAwareness.optimizeNotificationTiming(userId);
  }
}

export const aiEngineService = new AIEngineService();
