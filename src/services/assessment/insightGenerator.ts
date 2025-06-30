
import { supabase } from "@/integrations/supabase/client";
import { smartPersonalizationService } from "@/services/personalization/smartPersonalizationService";

export interface InsightData {
  userId: string;
  daysActive: number;
  totalResponses: number;
  categoryBreakdown: { [category: string]: number };
  trendData: Array<{ date: string; category: string; score: number }>;
  wellbeingMetrics: {
    avgMood: number | null;
    avgStress: number | null;
    avgEnergy: number | null;
  };
}

export const insightGenerator = {
  async generateComprehensiveInsights(userId: string): Promise<{
    immediate: any[];
    patterns: any[];
    trends: any[];
    recommendations: any[];
  }> {
    const insightData = await this.gatherInsightData(userId);
    
    return {
      immediate: await this.generateImmediateInsights(insightData),
      patterns: await this.generatePatternInsights(insightData),
      trends: await this.generateTrendInsights(insightData),
      recommendations: await smartPersonalizationService.generateGrowthRecommendations(userId)
    };
  },

  async gatherInsightData(userId: string): Promise<InsightData> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const [responsesData, checkinsData] = await Promise.all([
      supabase
        .from('question_responses')
        .select('*, assessment_questions(category)')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true }),
      supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true })
    ]);

    const responses = responsesData.data || [];
    const checkins = checkinsData.data || [];

    // Calculate metrics
    const uniqueDays = new Set([
      ...checkins.map(c => c.date),
      ...responses.map(r => r.created_at.split('T')[0])
    ]).size;

    const categoryBreakdown: { [category: string]: number } = {};
    responses.forEach(r => {
      const category = (r as any).assessment_questions?.category || 'other';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    const trendData = responses.map(r => ({
      date: r.created_at.split('T')[0],
      category: (r as any).assessment_questions?.category || 'other',
      score: r.response_score
    }));

    const wellbeingMetrics = {
      avgMood: checkins.length > 0 
        ? checkins.reduce((sum, c) => sum + (c.mood_score || 0), 0) / checkins.filter(c => c.mood_score).length || null
        : null,
      avgStress: checkins.length > 0 
        ? checkins.reduce((sum, c) => sum + (c.stress_level || 0), 0) / checkins.filter(c => c.stress_level).length || null
        : null,
      avgEnergy: checkins.length > 0 
        ? checkins.reduce((sum, c) => sum + (c.energy_level || 0), 0) / checkins.filter(c => c.energy_level).length || null
        : null
    };

    return {
      userId,
      daysActive: uniqueDays,
      totalResponses: responses.length + checkins.length,
      categoryBreakdown,
      trendData,
      wellbeingMetrics
    };
  },

  async generateImmediateInsights(data: InsightData): Promise<any[]> {
    const insights: any[] = [];

    // Today's snapshot
    const today = new Date().toISOString().split('T')[0];
    const todayData = data.trendData.filter(t => t.date === today);
    
    if (todayData.length > 0) {
      const avgToday = todayData.reduce((sum, t) => sum + t.score, 0) / todayData.length;
      insights.push({
        type: 'daily_snapshot',
        title: "Today's Performance",
        message: `Average response today: ${avgToday.toFixed(1)}/5 across ${todayData.length} questions`,
        confidence: 1.0,
        priority: 'high'
      });
    }

    // Streak information
    const dates = Array.from(new Set(data.trendData.map(t => t.date))).sort();
    let currentStreak = 0;
    let checkDate = new Date();
    
    for (let i = dates.length - 1; i >= 0; i--) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    if (currentStreak > 0) {
      insights.push({
        type: 'streak',
        title: 'Consistency Streak',
        message: `You're on a ${currentStreak}-day check-in streak! ${currentStreak >= 7 ? 'Excellent consistency!' : 'Keep building this habit!'}`,
        confidence: 1.0,
        priority: currentStreak >= 7 ? 'high' : 'medium'
      });
    }

    return insights;
  },

  async generatePatternInsights(data: InsightData): Promise<any[]> {
    if (data.daysActive < 7) return [];

    const insights: any[] = [];

    // Category performance patterns
    Object.entries(data.categoryBreakdown).forEach(([category, count]) => {
      if (count >= 5) {
        const categoryData = data.trendData.filter(t => t.category === category);
        const avgScore = categoryData.reduce((sum, t) => sum + t.score, 0) / categoryData.length;
        const trend = this.calculateTrend(categoryData.map(t => t.score));

        insights.push({
          type: 'category_pattern',
          category,
          title: `${category.replace('_', ' ')} Pattern`,
          message: `Average ${avgScore.toFixed(1)}/5 with ${trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable'} trend`,
          confidence: Math.min(0.9, count / 10),
          metrics: { average: avgScore, trend, responses: count }
        });
      }
    });

    // Wellbeing patterns
    if (data.wellbeingMetrics.avgMood && data.wellbeingMetrics.avgStress) {
      const moodStressBalance = data.wellbeingMetrics.avgMood - data.wellbeingMetrics.avgStress;
      insights.push({
        type: 'wellbeing_balance',
        title: 'Mood-Stress Balance',
        message: moodStressBalance > 1 
          ? 'Your mood generally outweighs stress levels - great balance!'
          : moodStressBalance < -1 
            ? 'Stress levels are consistently higher than mood - consider stress management'
            : 'Balanced mood and stress levels',
        confidence: 0.8,
        metrics: { balance: moodStressBalance }
      });
    }

    return insights;
  },

  async generateTrendInsights(data: InsightData): Promise<any[]> {
    if (data.daysActive < 15) return [];

    const insights: any[] = [];

    // Weekly performance trends
    const weeklyData = this.groupDataByWeek(data.trendData);
    if (weeklyData.length >= 2) {
      const weeklyAverages = weeklyData.map(week => 
        week.scores.reduce((sum, score) => sum + score, 0) / week.scores.length
      );
      
      const overallTrend = this.calculateTrend(weeklyAverages);
      insights.push({
        type: 'weekly_trend',
        title: 'Weekly Performance Trend',
        message: `Your weekly performance shows ${overallTrend > 0.1 ? 'consistent improvement' : overallTrend < -0.1 ? 'some decline' : 'stable patterns'} over time`,
        confidence: 0.9,
        metrics: { trend: overallTrend, weeks: weeklyData.length }
      });
    }

    // Category evolution
    const majorCategories = Object.entries(data.categoryBreakdown)
      .filter(([_, count]) => count >= 10)
      .map(([category]) => category);

    majorCategories.forEach(category => {
      const categoryTrend = data.trendData
        .filter(t => t.category === category)
        .map(t => t.score);
      
      if (categoryTrend.length >= 10) {
        const trend = this.calculateTrend(categoryTrend);
        insights.push({
          type: 'category_evolution',
          category,
          title: `${category.replace('_', ' ')} Evolution`,
          message: `Long-term ${category} trend shows ${trend > 0.1 ? 'strong growth' : trend < -0.1 ? 'areas for development' : 'consistent performance'}`,
          confidence: 0.85,
          metrics: { trend, dataPoints: categoryTrend.length }
        });
      }
    });

    return insights;
  },

  groupDataByWeek(trendData: Array<{ date: string; score: number }>): Array<{ week: string; scores: number[] }> {
    const weeklyData: { [week: string]: number[] } = {};
    
    trendData.forEach(({ date, score }) => {
      const weekStart = this.getWeekStart(new Date(date));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) weeklyData[weekKey] = [];
      weeklyData[weekKey].push(score);
    });

    return Object.entries(weeklyData).map(([week, scores]) => ({ week, scores }));
  },

  getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day;
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  },

  calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }
};
