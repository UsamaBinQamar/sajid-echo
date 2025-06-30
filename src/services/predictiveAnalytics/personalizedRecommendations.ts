
import { supabase } from "@/integrations/supabase/client";
import { TrendPrediction, PredictiveInsight } from "./index";

class PersonalizedRecommendations {
  async generate(userId: string, predictions: TrendPrediction[]): Promise<PredictiveInsight[]> {
    const recommendations: PredictiveInsight[] = [];

    // Get user's historical patterns
    const userPatterns = await this.getUserPatterns(userId);
    
    // Generate context-aware recommendations
    predictions.forEach(prediction => {
      const recommendation = this.generateCategoryRecommendation(prediction, userPatterns);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    });

    // Add time-based recommendations
    const timeBasedRecs = await this.generateTimeBasedRecommendations(userId);
    recommendations.push(...timeBasedRecs);

    return recommendations;
  }

  private async getUserPatterns(userId: string) {
    // Get recent check-ins and responses to understand patterns
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    const { data: responses } = await supabase
      .from('question_responses')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    return { checkins: checkins || [], responses: responses || [] };
  }

  private generateCategoryRecommendation(
    prediction: TrendPrediction, 
    patterns: any
  ): PredictiveInsight | null {
    if (prediction.confidence < 0.5) return null;

    const recommendations = this.getCategoryRecommendations(prediction.category);
    
    return {
      type: 'recommendation',
      category: prediction.category,
      message: `Based on your patterns, here's how to improve your ${this.getCategoryDisplayName(prediction.category)}`,
      confidence: prediction.confidence * 0.8, // Slightly lower confidence for recommendations
      timeframe: 'next 7-14 days',
      actionItems: recommendations
    };
  }

  private async generateTimeBasedRecommendations(userId: string): Promise<PredictiveInsight[]> {
    const recommendations: PredictiveInsight[] = [];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Weekend recommendations
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      recommendations.push({
        type: 'recommendation',
        category: 'personal_growth',
        message: 'Perfect weekend opportunity for self-care and reflection',
        confidence: 0.8,
        timeframe: 'this weekend',
        actionItems: [
          'Take time for a hobby you enjoy',
          'Reflect on your week and plan ahead',
          'Spend quality time with loved ones',
          'Get outside for fresh air and movement'
        ]
      });
    }

    // Evening recommendations
    if (hour >= 18) {
      recommendations.push({
        type: 'recommendation',
        category: 'sleep_recovery',
        message: 'Evening wind-down recommendations for better sleep',
        confidence: 0.75,
        timeframe: 'tonight',
        actionItems: [
          'Start winding down with relaxing activities',
          'Limit screen time in the next 2 hours',
          'Prepare for tomorrow to reduce morning stress',
          'Practice gratitude or journaling'
        ]
      });
    }

    return recommendations;
  }

  private getCategoryRecommendations(category: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'sleep_recovery': [
        'Establish a consistent bedtime routine',
        'Create a sleep-friendly environment (cool, dark, quiet)',
        'Limit caffeine after 2 PM',
        'Try relaxation techniques before bed'
      ],
      'work_boundaries': [
        'Set specific work hours and communicate them',
        'Use time-blocking for focused work periods',
        'Take regular breaks throughout the day',
        'Practice saying no to non-essential requests'
      ],
      'social_relationships': [
        'Schedule regular check-ins with friends and family',
        'Be present during social interactions (put away devices)',
        'Express gratitude and appreciation to others',
        'Join groups or activities aligned with your interests'
      ],
      'health_wellness': [
        'Incorporate movement into your daily routine',
        'Focus on nutritious, balanced meals',
        'Stay hydrated throughout the day',
        'Practice stress management techniques'
      ],
      'personal_growth': [
        'Set aside time for learning or skill development',
        'Reflect on your values and goals regularly',
        'Seek feedback and embrace growth opportunities',
        'Celebrate small wins and progress'
      ]
    };

    return recommendations[category] || [
      'Focus on small, consistent improvements',
      'Be patient with yourself during the process',
      'Seek support when needed'
    ];
  }

  private getCategoryDisplayName(category: string): string {
    const names: { [key: string]: string } = {
      sleep_recovery: "Sleep & Recovery",
      social_relationships: "Relationships", 
      health_wellness: "Health & Wellness",
      work_boundaries: "Work Boundaries",
      personal_growth: "Personal Growth",
      financial_stress: "Financial Wellness"
    };
    return names[category] || category;
  }
}

export const personalizedRecommendations = new PersonalizedRecommendations();
