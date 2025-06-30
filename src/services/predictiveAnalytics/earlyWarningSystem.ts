
import { TrendPrediction, PredictiveInsight } from "./index";

class EarlyWarningSystem {
  async generateWarnings(userId: string, predictions: TrendPrediction[]): Promise<PredictiveInsight[]> {
    const warnings: PredictiveInsight[] = [];

    predictions.forEach(prediction => {
      // High-priority warnings for severe declining trends
      if (prediction.trend === 'declining' && prediction.predictedScore < 2.5 && prediction.confidence > 0.7) {
        warnings.push({
          type: 'warning',
          category: prediction.category,
          message: `Your ${this.getCategoryDisplayName(prediction.category)} is predicted to decline significantly in the next ${prediction.daysAhead} days`,
          confidence: prediction.confidence,
          timeframe: `${prediction.daysAhead} days`,
          actionItems: this.generateActionItems(prediction.category, 'severe'),
          severity: 'high'
        });
      }
      // Medium-priority warnings for moderate decline
      else if (prediction.trend === 'declining' && prediction.predictedScore < 3.5 && prediction.confidence > 0.6) {
        warnings.push({
          type: 'warning',
          category: prediction.category,
          message: `Your ${this.getCategoryDisplayName(prediction.category)} shows signs of decline`,
          confidence: prediction.confidence,
          timeframe: `${prediction.daysAhead} days`,
          actionItems: this.generateActionItems(prediction.category, 'moderate'),
          severity: 'medium'
        });
      }
      // Positive predictions for improvement
      else if (prediction.trend === 'improving' && prediction.predictedScore > 4 && prediction.confidence > 0.7) {
        warnings.push({
          type: 'improvement',
          category: prediction.category,
          message: `Great news! Your ${this.getCategoryDisplayName(prediction.category)} is trending upward`,
          confidence: prediction.confidence,
          timeframe: `${prediction.daysAhead} days`,
          actionItems: [`Continue your current positive practices in ${this.getCategoryDisplayName(prediction.category)}`],
          severity: 'low'
        });
      }
    });

    return warnings;
  }

  private generateActionItems(category: string, severity: 'severe' | 'moderate'): string[] {
    const actionMap: { [key: string]: { severe: string[], moderate: string[] } } = {
      'sleep_recovery': {
        severe: [
          'Prioritize 7-8 hours of sleep tonight',
          'Consider taking a mental health day',
          'Establish a strict bedtime routine'
        ],
        moderate: [
          'Review your sleep schedule',
          'Limit screen time before bed',
          'Create a relaxing bedtime routine'
        ]
      },
      'work_boundaries': {
        severe: [
          'Set strict work hours and stick to them',
          'Delegate urgent tasks immediately',
          'Speak with your manager about workload'
        ],
        moderate: [
          'Review your work-life balance',
          'Set boundaries on after-hours communication',
          'Take regular breaks during work'
        ]
      },
      'social_relationships': {
        severe: [
          'Reach out to a trusted friend or family member',
          'Consider professional counseling',
          'Schedule quality time with loved ones'
        ],
        moderate: [
          'Plan a social activity this week',
          'Check in with friends and family',
          'Join a community group or activity'
        ]
      },
      'health_wellness': {
        severe: [
          'Schedule a check-up with your healthcare provider',
          'Focus on basic health needs: sleep, nutrition, movement',
          'Consider stress management techniques'
        ],
        moderate: [
          'Increase physical activity',
          'Review your nutrition habits',
          'Practice mindfulness or meditation'
        ]
      }
    };

    return actionMap[category]?.[severity] || [
      'Take time to address this area of your wellbeing',
      'Consider speaking with a professional',
      'Focus on self-care practices'
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

export const earlyWarningSystem = new EarlyWarningSystem();
