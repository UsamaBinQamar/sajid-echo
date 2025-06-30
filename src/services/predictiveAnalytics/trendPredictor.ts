
import { supabase } from "@/integrations/supabase/client";
import { TrendPrediction } from "./index";

class TrendPredictor {
  async predictTrends(userId: string, daysAhead: number = 7): Promise<TrendPrediction[]> {
    // Get historical data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: responses } = await supabase
      .from("question_responses")
      .select(`
        response_score,
        created_at,
        assessment_questions(category)
      `)
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (!responses || responses.length < 5) {
      return [];
    }

    // Group by category and calculate trends
    const categoryData: { [key: string]: { scores: number[], dates: Date[] } } = {};
    
    responses.forEach((response: any) => {
      const category = response.assessment_questions?.category;
      if (category) {
        if (!categoryData[category]) {
          categoryData[category] = { scores: [], dates: [] };
        }
        categoryData[category].scores.push(response.response_score);
        categoryData[category].dates.push(new Date(response.created_at));
      }
    });

    const predictions: TrendPrediction[] = [];

    Object.entries(categoryData).forEach(([category, data]) => {
      const prediction = this.calculateTrendPrediction(category, data.scores, data.dates, daysAhead);
      if (prediction) {
        predictions.push(prediction);
      }
    });

    return predictions;
  }

  private calculateTrendPrediction(
    category: string, 
    scores: number[], 
    dates: Date[], 
    daysAhead: number
  ): TrendPrediction | null {
    if (scores.length < 3) return null;

    // Simple linear regression for trend prediction
    const n = scores.length;
    const currentScore = scores[n - 1];
    
    // Calculate slope using least squares
    const xValues = Array.from({ length: n }, (_, i) => i);
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = scores.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((acc, x, i) => acc + x * scores[i], 0);
    const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict score for daysAhead
    const futureX = n + (daysAhead / 7); // Convert days to weeks for prediction
    const predictedScore = Math.max(1, Math.min(5, slope * futureX + intercept));

    // Determine trend direction
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (Math.abs(slope) > 0.1) {
      trend = slope > 0 ? 'improving' : 'declining';
    }

    // Calculate confidence based on data consistency
    const variance = scores.reduce((acc, score) => {
      const predicted = slope * scores.indexOf(score) + intercept;
      return acc + Math.pow(score - predicted, 2);
    }, 0) / n;
    
    const confidence = Math.max(0.3, Math.min(0.95, 1 - variance / 2));

    return {
      category,
      currentScore,
      predictedScore,
      trend,
      confidence,
      daysAhead
    };
  }
}

export const trendPredictor = new TrendPredictor();
