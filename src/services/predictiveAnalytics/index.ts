
import { supabase } from "@/integrations/supabase/client";
import { openAIService } from "@/services/ai/openAIService";

export interface PredictiveInsight {
  type: 'warning' | 'improvement' | 'recommendation';
  category?: string;
  message: string;
  confidence: number;
  timeframe: string;
  actionItems: string[];
  severity?: 'low' | 'medium' | 'high';
}

export interface TrendPrediction {
  category: string;
  currentScore: number;
  predictedScore: number;
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  daysAhead?: number;
}

class PredictiveAnalyticsService {
  async generatePredictiveInsights(userId: string): Promise<PredictiveInsight[]> {
    const userData = await this.getUserPredictiveData(userId);
    
    const systemMessage = `You are a predictive analytics expert for wellness data.
    Analyze patterns to predict future trends and provide early warnings.
    Focus on actionable insights that can prevent negative outcomes.`;

    const prompt = `Analyze this user's wellness data for predictive insights:
    ${JSON.stringify(userData)}
    
    Generate 2-3 predictive insights as JSON array with:
    - type: warning|improvement|recommendation
    - message: clear prediction or insight
    - confidence: 0-1
    - timeframe: when this might occur
    - actionItems: preventive or enhancement actions
    - severity: low|medium|high (for warnings)`;

    try {
      const response = await openAIService.generateCompletion(prompt, systemMessage, 0.4);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return [];
    }
  }

  async getTrendPredictions(userId: string): Promise<TrendPrediction[]> {
    const { data: recentData } = await supabase
      .from('daily_checkins')
      .select('mood_score, stress_level, energy_level, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    if (!recentData || recentData.length < 3) {
      return [];
    }

    const predictions: TrendPrediction[] = [];
    const categories = ['mood_score', 'stress_level', 'energy_level'];

    categories.forEach(category => {
      const values = recentData
        .map(d => d[category as keyof typeof d])
        .filter(v => v !== null) as number[];
      
      if (values.length < 3) return;

      const current = values[values.length - 1];
      const recent = values.slice(-5);
      const trend = this.calculateTrend(recent);
      const predicted = this.predictNext(recent);

      predictions.push({
        category: category.replace('_', ' '),
        currentScore: current,
        predictedScore: predicted,
        trend: trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable',
        confidence: Math.min(values.length / 10, 0.8),
        daysAhead: 7
      });
    });

    return predictions;
  }

  async getBurnoutRisk(userId: string) {
    const userData = await this.getUserPredictiveData(userId);
    
    const systemMessage = `You are a burnout prevention expert analyzing wellness data.
    Assess burnout risk based on stress patterns, energy levels, and engagement.`;

    const prompt = `Assess burnout risk for this user:
    ${JSON.stringify(userData)}
    
    Return JSON with:
    - risk: low|medium|high
    - score: 0-10 (burnout risk score)
    - factors: array of contributing risk factors
    - recommendations: specific prevention actions`;

    try {
      const response = await openAIService.generateCompletion(prompt, systemMessage, 0.3);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error assessing burnout risk:', error);
      return { risk: 'low', score: 2, factors: [], recommendations: [] };
    }
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const first = values.slice(0, Math.ceil(values.length / 2));
    const last = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
    const lastAvg = last.reduce((a, b) => a + b, 0) / last.length;
    
    return (lastAvg - firstAvg) / firstAvg;
  }

  private predictNext(values: number[]): number {
    if (values.length < 2) return values[0] || 3;
    
    const trend = this.calculateTrend(values);
    const current = values[values.length - 1];
    
    return Math.max(1, Math.min(5, current + (current * trend * 0.5)));
  }

  private async getUserPredictiveData(userId: string) {
    const timeFilter = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString();

    const [checkins, journals, patterns] = await Promise.all([
      supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false }),

      supabase
        .from('journal_entries')
        .select('mood_score, created_at')
        .eq('user_id', userId)
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false }),

      supabase
        .from('assessment_patterns')
        .select('*')
        .eq('user_id', userId)
    ]);

    return {
      dailyCheckins: checkins.data || [],
      journalEntries: journals.data || [],
      assessmentPatterns: patterns.data || [],
      timeframe: 21,
      analysisDate: new Date().toISOString()
    };
  }
}

export const predictiveAnalyticsService = new PredictiveAnalyticsService();
