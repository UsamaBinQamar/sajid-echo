
import { supabase } from "@/integrations/supabase/client";
import { TimingRecommendation } from "./types";

export class TimingRecommendations {
  async getOptimalTimingRecommendations(userId: string): Promise<TimingRecommendation> {
    const { data: responses } = await supabase
      .from("question_responses")
      .select("created_at, response_score")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!responses || responses.length < 10) {
      return {
        preferredTime: "morning",
        confidence: 0.3,
        reasoning: "Not enough data yet - morning is generally optimal for reflection"
      };
    }

    // Analyze response times and quality
    const timeAnalysis = responses.reduce((acc, response) => {
      const hour = new Date(response.created_at).getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      
      if (!acc[timeOfDay]) {
        acc[timeOfDay] = { scores: [], count: 0 };
      }
      acc[timeOfDay].scores.push(response.response_score);
      acc[timeOfDay].count++;
      
      return acc;
    }, {} as any);

    // Find time with highest average scores
    let bestTime = 'morning';
    let bestAverage = 0;
    let confidence = 0;

    Object.entries(timeAnalysis).forEach(([time, data]: [string, any]) => {
      const average = data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length;
      if (average > bestAverage && data.count >= 3) {
        bestAverage = average;
        bestTime = time;
        confidence = Math.min(0.9, data.count / 10); // Higher confidence with more data
      }
    });

    return {
      preferredTime: bestTime,
      confidence,
      reasoning: `Based on ${responses.length} responses, you tend to provide higher quality responses in the ${bestTime}`
    };
  }
}

export const timingRecommendations = new TimingRecommendations();
