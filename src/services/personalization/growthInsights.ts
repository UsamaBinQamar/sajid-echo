
import { supabase } from "@/integrations/supabase/client";
import { PersonalizationInsight, AssessmentPattern } from "./types";
import { journalAnalyzer } from "./journalAnalyzer";

interface DatabaseAssessmentPattern {
  avg_score: number;
  category: string;
  created_at: string;
  id: string;
  last_low_score_date: string;
  question_frequency: number;
  trend_direction: string;
  updated_at: string;
  user_id: string;
}

export class GrowthInsights {
  async generateGrowthRecommendations(userId: string): Promise<PersonalizationInsight[]> {
    const [journalInsights, patterns] = await Promise.all([
      journalAnalyzer.analyzeJournalPatterns(userId),
      this.getAssessmentPatterns(userId)
    ]);

    const recommendations: PersonalizationInsight[] = [...journalInsights];

    // Analyze assessment patterns for declining trends
    patterns.forEach(pattern => {
      if (pattern.trend_direction === 'declining' && pattern.avg_score < 3) {
        recommendations.push({
          type: 'pattern',
          category: pattern.category,
          message: `Your ${this.getCategoryDisplayName(pattern.category)} scores have been declining recently`,
          confidence: 0.8,
          action_items: [
            `Focus on ${this.getCategoryDisplayName(pattern.category)} improvement`,
            'Consider setting specific goals in this area'
          ]
        });
      }

      if (pattern.trend_direction === 'improving' && pattern.avg_score > 4) {
        recommendations.push({
          type: 'pattern',
          category: pattern.category,
          message: `Great progress in ${this.getCategoryDisplayName(pattern.category)}! Keep it up!`,
          confidence: 0.9,
          action_items: [
            'Continue current strategies',
            'Consider sharing your success strategies'
          ]
        });
      }
    });

    return recommendations;
  }

  private async getAssessmentPatterns(userId: string): Promise<AssessmentPattern[]> {
    const { data, error } = await supabase
      .from("assessment_patterns")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching patterns:", error);
      return [];
    }

    // Transform database response to match our types
    return (data as DatabaseAssessmentPattern[] || []).map(item => ({
      category: item.category,
      avg_score: item.avg_score,
      trend_direction: this.mapTrendDirection(item.trend_direction),
      question_frequency: item.question_frequency
    }));
  }

  private mapTrendDirection(direction: string): 'declining' | 'improving' | 'stable' {
    switch (direction) {
      case 'declining':
        return 'declining';
      case 'improving':
        return 'improving';
      case 'stable':
        return 'stable';
      default:
        return 'stable'; // fallback
    }
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

export const growthInsights = new GrowthInsights();
