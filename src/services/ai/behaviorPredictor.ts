
import { supabase } from "@/integrations/supabase/client";
import { openAIService } from "./openAIService";
import { BehaviorPrediction } from "./types";

class BehaviorPredictor {
  async predictBehavior(userId: string, predictionType: string): Promise<BehaviorPrediction[]> {
    const userData = await this.getUserBehaviorData(userId);
    
    const systemMessage = `You are a behavioral prediction expert using wellness data patterns.
    Analyze user data to predict future wellness trends and potential risks.
    Base predictions on established psychological and behavioral patterns.`;

    const prompt = `Analyze this user's wellness data for behavioral predictions:
    ${JSON.stringify(userData)}
    
    Focus on predicting: ${predictionType}
    
    Generate predictions as JSON array with:
    - predictionType: mood_decline|stress_spike|engagement_drop|burnout_risk|positive_trend
    - probability: 0-1
    - timeframe: when this might occur
    - triggerFactors: what might cause this
    - preventiveActions: specific actions to prevent negative outcomes
    - confidenceLevel: 0-1 based on data quality`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.4);
    return JSON.parse(response);
  }

  async identifyRiskPatterns(userId: string): Promise<BehaviorPrediction[]> {
    const userData = await this.getUserBehaviorData(userId, 30); // 30 days of data
    
    const systemMessage = `You are a risk pattern identification expert.
    Identify concerning patterns that could lead to wellness decline or burnout.
    Focus on early warning signs and prevention.`;

    const prompt = `Identify risk patterns in this user data:
    ${JSON.stringify(userData)}
    
    Look for:
    1. Declining mood trends
    2. Increasing stress patterns
    3. Engagement drops
    4. Sleep disruption patterns
    5. Social isolation indicators
    
    Return high-confidence risk predictions only (confidence > 0.7)`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.3);
    const riskPredictions = JSON.parse(response);

    // Store risk patterns for tracking
    await this.storeRiskPatterns(userId, riskPredictions);

    return riskPredictions;
  }

  private async getUserBehaviorData(userId: string, days: number = 14) {
    const timeFilter = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [checkins, journals, responses, patterns] = await Promise.all([
      // Daily check-ins
      supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false }),

      // Journal entries
      supabase
        .from('journal_entries')
        .select('mood_score, created_at, tags')
        .eq('user_id', userId)
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false }),

      // Question responses
      supabase
        .from('question_responses')
        .select('response_score, created_at')
        .eq('user_id', userId)
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false }),

      // Assessment patterns
      supabase
        .from('assessment_patterns')
        .select('*')
        .eq('user_id', userId)
    ]);

    return {
      dailyCheckins: checkins.data || [],
      journalEntries: journals.data || [],
      questionResponses: responses.data || [],
      assessmentPatterns: patterns.data || [],
      timeframe: days,
      analysisDate: new Date().toISOString()
    };
  }

  private async storeRiskPatterns(userId: string, riskPredictions: BehaviorPrediction[]) {
    try {
      // In a real implementation, we'd store these in a risk_patterns table
      console.log('Risk patterns identified for user:', userId, riskPredictions);
      // This would trigger appropriate interventions and notifications
    } catch (error) {
      console.error('Error storing risk patterns:', error);
    }
  }

  async getPersonalizedInterventionTiming(userId: string): Promise<string[]> {
    const userData = await this.getUserBehaviorData(userId, 7);
    
    const systemMessage = `Analyze user patterns to determine optimal intervention timing.
    Consider their activity patterns, mood cycles, and engagement history.`;

    const prompt = `Based on this user's behavior patterns:
    ${JSON.stringify(userData)}
    
    Recommend optimal times for:
    1. Daily check-ins
    2. Journal prompts
    3. Wellness interventions
    4. Educational content
    
    Return as JSON array of time recommendations with reasoning.`;

    const response = await openAIService.generateCompletion(prompt, systemMessage);
    return JSON.parse(response);
  }
}

export const behaviorPredictor = new BehaviorPredictor();
