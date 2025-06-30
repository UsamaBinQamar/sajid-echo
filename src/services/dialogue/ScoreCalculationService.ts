
export interface ScoreResult {
  empathy_score: number;
  clarity_score: number;
  inclusion_score: number;
  tone_analysis: any;
}

export class ScoreCalculationService {
  static calculateOverallScore(scores: ScoreResult[]): {
    overall_empathy: number;
    overall_clarity: number;
    overall_inclusion: number;
    overall_average: number;
  } {
    if (scores.length === 0) {
      return {
        overall_empathy: 0,
        overall_clarity: 0,
        overall_inclusion: 0,
        overall_average: 0
      };
    }

    const totals = scores.reduce(
      (acc, score) => ({
        empathy: acc.empathy + score.empathy_score,
        clarity: acc.clarity + score.clarity_score,
        inclusion: acc.inclusion + score.inclusion_score
      }),
      { empathy: 0, clarity: 0, inclusion: 0 }
    );

    const count = scores.length;
    const overall_empathy = totals.empathy / count;
    const overall_clarity = totals.clarity / count;
    const overall_inclusion = totals.inclusion / count;
    const overall_average = (overall_empathy + overall_clarity + overall_inclusion) / 3;

    return {
      overall_empathy: Number(overall_empathy.toFixed(2)),
      overall_clarity: Number(overall_clarity.toFixed(2)),
      overall_inclusion: Number(overall_inclusion.toFixed(2)),
      overall_average: Number(overall_average.toFixed(2))
    };
  }

  static getScoreLevel(score: number): 'excellent' | 'strong' | 'good' | 'developing' | 'needs_focus' {
    if (score >= 4.5) return 'excellent';
    if (score >= 4) return 'strong';
    if (score >= 3) return 'good';
    if (score >= 2) return 'developing';
    return 'needs_focus';
  }

  static getImprovementAreas(scores: ScoreResult[]): string[] {
    const averages = this.calculateOverallScore(scores);
    const areas: string[] = [];

    if (averages.overall_empathy < 3) {
      areas.push('Emotional Intelligence & Empathy');
    }
    if (averages.overall_clarity < 3) {
      areas.push('Clear Communication');
    }
    if (averages.overall_inclusion < 3) {
      areas.push('Inclusive Leadership');
    }

    return areas;
  }
}
