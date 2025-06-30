
import { supabase } from "@/integrations/supabase/client";
import { PersonalizationInsight } from "./types";

export class QuestionRecommendations {
  async getContextualQuestionBoosts(userId: string): Promise<{ [questionId: string]: number }> {
    const recentResponses = await supabase
      .from("question_responses")
      .select(`
        *,
        assessment_questions(id, category, target_focus_areas)
      `)
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (recentResponses.error || !recentResponses.data) {
      return {};
    }

    const boosts: { [questionId: string]: number } = {};

    // Boost questions in categories where user scored low recently
    const lowScoreCategories = new Set();
    recentResponses.data.forEach(response => {
      if (response.response_score <= 2 && response.assessment_questions) {
        lowScoreCategories.add(response.assessment_questions.category);
      }
    });

    // Get all questions and boost those in struggling categories
    const { data: allQuestions } = await supabase
      .from("assessment_questions")
      .select("*");

    if (allQuestions) {
      allQuestions.forEach(question => {
        if (lowScoreCategories.has(question.category)) {
          boosts[question.id] = 25; // Significant boost for struggling areas
        }
      });
    }

    return boosts;
  }

  async selectPersonalizedQuestions(
    userId: string,
    userFocusAreas: string[],
    maxQuestions: number = 3,
    insights: PersonalizationInsight[]
  ): Promise<any[]> {
    // Get base adaptive questions
    const { adaptiveAssessmentService } = await import('../adaptiveAssessment');
    const baseQuestions = await adaptiveAssessmentService.selectAdaptiveQuestions(
      userId,
      userFocusAreas
    );

    // Get personalization boosts
    const contextualBoosts = await this.getContextualQuestionBoosts(userId);

    // Apply personalization scoring
    const personalizedQuestions = baseQuestions.map(question => {
      let personalizedScore = question.relevanceScore || 0;

      // Apply contextual boosts
      if (contextualBoosts[question.id]) {
        personalizedScore += contextualBoosts[question.id];
      }

      // Boost questions mentioned in insights
      insights.forEach(insight => {
        if (insight.suggested_questions?.includes(question.category)) {
          personalizedScore += 15 * insight.confidence;
        }
      });

      return {
        ...question,
        personalizedScore
      };
    });

    // Sort by personalized score and return top questions
    return personalizedQuestions
      .sort((a, b) => (b.personalizedScore || 0) - (a.personalizedScore || 0))
      .slice(0, maxQuestions);
  }
}

export const questionRecommendations = new QuestionRecommendations();
