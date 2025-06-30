
import { supabase } from "@/integrations/supabase/client";
import { AssessmentQuestion, UserPreferences, QuestionResponse } from "./types";
import { advancedQuestionSelector } from "./advancedSelector";

class AdaptiveAssessmentService {
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from("user_assessment_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user preferences:", error);
      return null;
    }

    return data;
  }

  async initializeUserPreferences(userId: string, focusAreas: string[]): Promise<void> {
    const { error } = await supabase
      .from("user_assessment_preferences")
      .insert({
        user_id: userId,
        preferred_frequency: "adaptive",
        max_daily_questions: 3,
        focus_areas_priority: focusAreas,
        skip_weekends: false
      });

    if (error) {
      console.error("Error initializing user preferences:", error);
    }
  }

  async selectAdaptiveQuestions(
    userId: string, 
    userFocusAreas: string[],
    useAdvancedFeatures: boolean = false
  ): Promise<AssessmentQuestion[]> {
    // Get user preferences or initialize them
    let preferences = await this.getUserPreferences(userId);
    if (!preferences) {
      await this.initializeUserPreferences(userId, userFocusAreas);
      preferences = await this.getUserPreferences(userId);
    }

    if (!preferences) {
      return this.getDefaultQuestions();
    }

    // Use advanced question selection
    return advancedQuestionSelector.selectAdvancedQuestions(
      userId,
      userFocusAreas,
      preferences.max_daily_questions,
      useAdvancedFeatures
    );
  }

  private async getDefaultQuestions(): Promise<AssessmentQuestion[]> {
    const { data, error } = await supabase
      .from("assessment_questions")
      .select("*")
      .eq("frequency_type", "daily")
      .eq("priority_level", 1)
      .limit(3);

    if (error) {
      console.error("Error fetching default questions:", error);
      return [];
    }

    return data || [];
  }

  async submitResponses(userId: string, responses: QuestionResponse[]): Promise<boolean> {
    const { error } = await supabase
      .from("question_responses")
      .insert(
        responses.map(response => ({
          ...response,
          user_id: userId
        }))
      );

    if (error) {
      console.error("Error submitting responses:", error);
      return false;
    }

    return true;
  }

  generateSessionId(): string {
    return crypto.randomUUID();
  }
}

export const adaptiveAssessmentService = new AdaptiveAssessmentService();
export type { AssessmentQuestion, UserPreferences, QuestionResponse } from "./types";
