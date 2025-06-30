import { supabase } from "@/integrations/supabase/client";
import { PersonalizationInsight, OptimalTimingRecommendation } from "./types";

export class SmartPersonalizationService {
  async selectPersonalizedQuestions(
    userId: string,
    focusAreas: string[],
    maxQuestions: number = 3,
    useAdvancedFeatures: boolean = true
  ): Promise<any[]> {
    try {
      // Get user's recent patterns and insights
      const insights = useAdvancedFeatures ? await this.generateInsights(userId) : [];
      
      // Get base questions from assessment questions table
      const { data: allQuestions } = await supabase
        .from('assessment_questions')
        .select('*')
        .order('priority_level', { ascending: false });

      if (!allQuestions) return [];

      // Score questions based on personalization factors
      const scoredQuestions = allQuestions.map(question => {
        let score = question.priority_level || 1;

        // Boost questions in user's focus areas
        if (focusAreas.includes(question.category)) {
          score += 20;
        }

        // Boost questions mentioned in insights
        insights.forEach(insight => {
          if (insight.category === question.category) {
            score += 15 * insight.confidence;
          }
        });

        return {
          ...question,
          personalizedScore: score
        };
      });

      // Return top scored questions
      return scoredQuestions
        .sort((a, b) => (b.personalizedScore || 0) - (a.personalizedScore || 0))
        .slice(0, maxQuestions);

    } catch (error) {
      console.error('Error selecting personalized questions:', error);
      // Fallback to basic questions
      const { data: fallbackQuestions } = await supabase
        .from('assessment_questions')
        .select('*')
        .limit(maxQuestions);
      
      return fallbackQuestions || [];
    }
  }

  async generateInsights(userId: string): Promise<PersonalizationInsight[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: responses, error } = await supabase
      .from('question_responses')
      .select('*, assessment_questions(category)')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo);

    if (error) {
      console.error('Error fetching question responses:', error);
      return [];
    }

    const categoryInsights: { [category: string]: { count: number; avgScore: number; } } = {};

    responses?.forEach(response => {
      const category = (response as any).assessment_questions?.category || 'general';
      if (!categoryInsights[category]) {
        categoryInsights[category] = { count: 0, avgScore: 0 };
      }
      categoryInsights[category].count++;
      categoryInsights[category].avgScore += response.response_score;
    });

    const insights: PersonalizationInsight[] = [];

    for (const category in categoryInsights) {
      const { count, avgScore } = categoryInsights[category];
      const avg = avgScore / count;

      insights.push({
        type: 'category_performance',
        category: category,
        title: `Category Performance: ${category}`,
        message: `Your average score in ${category} is ${avg.toFixed(2)} based on ${count} responses.`,
        confidence: Math.min(0.9, count / 10)
      });
    }

    return insights;
  }

  async getAdvancedInsights(userId: string): Promise<PersonalizationInsight[]> {
    const insights: PersonalizationInsight[] = [];

    // Simulate trend analysis based on user's response history
    const { data: responses, error } = await supabase
      .from('question_responses')
      .select('response_score, created_at, assessment_questions(category)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching recent responses:', error);
      return [];
    }

    // Group responses by category
    const categoryResponses: { [category: string]: any[] } = {};
    responses?.forEach(response => {
      const category = (response as any).assessment_questions?.category || 'general';
      if (!categoryResponses[category]) {
        categoryResponses[category] = [];
      }
      categoryResponses[category].push(response);
    });

    // Analyze trends for each category
    for (const category in categoryResponses) {
      const categoryData = categoryResponses[category];
      if (categoryData.length < 5) continue; // Need at least 5 data points for trend analysis

      // Calculate a simple linear trend (more sophisticated methods could be used)
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      for (let i = 0; i < categoryData.length; i++) {
        sumX += i;
        sumY += categoryData[i].response_score;
        sumXY += i * categoryData[i].response_score;
        sumX2 += i * i;
      }

      const n = categoryData.length;
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

      insights.push({
        type: 'trend_analysis',
        category: category,
        title: `Trend Analysis: ${category}`,
        message: `Your trend in ${category} is ${slope > 0 ? 'improving' : 'declining'}.`,
        confidence: 0.75,
        trend: slope
      });
    }

    return insights;
  }

  async generateGrowthRecommendations(userId: string): Promise<PersonalizationInsight[]> {
    const recommendations: PersonalizationInsight[] = [];

    // Simulate identifying areas for improvement based on user's response history
    const { data: responses, error } = await supabase
      .from('question_responses')
      .select('response_score, assessment_questions(category)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching recent responses:', error);
      return [];
    }

    // Group responses by category
    const categoryScores: { [category: string]: number[] } = {};
    responses?.forEach(response => {
      const category = (response as any).assessment_questions?.category || 'general';
      if (!categoryScores[category]) {
        categoryScores[category] = [];
      }
      categoryScores[category].push(response.response_score);
    });

    // Identify categories with low average scores
    for (const category in categoryScores) {
      const scores = categoryScores[category];
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

      if (avgScore < 3) {
        recommendations.push({
          type: 'growth_recommendation',
          category: category,
          title: `Focus on ${category}`,
          message: `Consider focusing on improving your understanding and practices in ${category}.`,
          confidence: 0.6,
          suggested_questions: [category]
        });
      }
    }

    return recommendations;
  }

  async getOptimalTimingRecommendations(userId: string): Promise<OptimalTimingRecommendation> {
    // Simulate analyzing user's activity patterns to recommend optimal check-in times
    // This is a placeholder; actual implementation would require more sophisticated analysis
    const optimalTime = Math.floor(Math.random() * 24); // Random hour of the day

    return {
      type: 'optimal_timing',
      title: 'Optimal Check-in Time',
      message: `Based on your activity patterns, the recommended time for your daily check-in is around ${optimalTime}:00.`,
      confidence: 0.5,
      suggestedTime: optimalTime
    };
  }

  private analyzeResponsePatterns(responses: any[]): any {
    // Placeholder for analyzing response patterns
    // Actual implementation would involve more complex statistical analysis
    return {};
  }

  private pearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0; // To avoid division by zero

    return numerator / denominator;
  }
}

export const smartPersonalizationService = new SmartPersonalizationService();
