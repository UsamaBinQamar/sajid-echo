
import { supabase } from "@/integrations/supabase/client";
import { AssessmentQuestion, UserPreferences, AssessmentPattern } from "./types";
import { dynamicQuestionGenerator, contextAnalyzer } from "../questionBank";
import { QuestionTemplate } from "../questionBank/questionCategories";

export class AdvancedQuestionSelector {
  async selectAdvancedQuestions(
    userId: string,
    userFocusAreas: string[],
    maxQuestions: number = 3,
    useAdvancedFeatures: boolean = true
  ): Promise<AssessmentQuestion[]> {
    console.log('Selecting advanced questions for user:', userId);
    
    if (!useAdvancedFeatures) {
      return this.getBasicQuestions(userId, userFocusAreas, maxQuestions);
    }

    try {
      // Build user context for dynamic generation
      const context = await contextAnalyzer.buildUserContext(userId);
      
      // Generate contextual questions using the expanded question bank
      const dynamicQuestions = await dynamicQuestionGenerator.generateContextualQuestions(
        context,
        maxQuestions
      );
      
      // Convert question templates to assessment questions
      const assessmentQuestions = await this.convertToAssessmentQuestions(dynamicQuestions);
      
      // Fallback to database questions if needed
      if (assessmentQuestions.length < maxQuestions) {
        const additionalQuestions = await this.getBasicQuestions(
          userId, 
          userFocusAreas, 
          maxQuestions - assessmentQuestions.length
        );
        assessmentQuestions.push(...additionalQuestions);
      }
      
      return assessmentQuestions.slice(0, maxQuestions);
      
    } catch (error) {
      console.error('Error in advanced question selection:', error);
      // Fallback to basic selection
      return this.getBasicQuestions(userId, userFocusAreas, maxQuestions);
    }
  }

  private async convertToAssessmentQuestions(
    templates: QuestionTemplate[]
  ): Promise<AssessmentQuestion[]> {
    return templates.map(template => ({
      id: template.id,
      category: template.category,
      question_text: template.question_text,
      emoji_options: ['😔', '😐', '🙂', '😊', '🤩'],
      priority_level: template.priority_level,
      target_focus_areas: template.target_focus_areas,
      frequency_type: template.frequency_type,
      relevanceScore: 50 // Base score for template questions
    }));
  }

  private async getBasicQuestions(
    userId: string,
    userFocusAreas: string[],
    maxQuestions: number
  ): Promise<AssessmentQuestion[]> {
    // Get user preferences
    const preferences = await this.getUserPreferences(userId);
    
    // Check weekend skip preference
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend && preferences?.skip_weekends) {
      return [];
    }

    // Get all available questions from database
    const { data: allQuestions, error } = await supabase
      .from("assessment_questions")
      .select("*");

    if (error || !allQuestions) {
      console.error("Error fetching questions:", error);
      return [];
    }

    // Get recent responses and patterns for scoring
    const [recentResponses, patterns] = await Promise.all([
      this.getRecentResponses(userId),
      this.getAssessmentPatterns(userId)
    ]);

    // Score and select questions
    const scoredQuestions = this.scoreQuestions(
      allQuestions,
      userFocusAreas,
      recentResponses,
      patterns
    );

    return scoredQuestions
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, maxQuestions);
  }

  private scoreQuestions(
    questions: any[],
    userFocusAreas: string[],
    recentResponses: any[],
    patterns: AssessmentPattern[]
  ): AssessmentQuestion[] {
    return questions.map(question => {
      let score = 0;

      // Priority level scoring
      score += (4 - question.priority_level) * 10;

      // Focus area alignment
      if (question.target_focus_areas && userFocusAreas) {
        const overlap = question.target_focus_areas.filter(area => 
          userFocusAreas.includes(area)
        ).length;
        score += overlap * 15;
      }

      // Pattern-based scoring
      const categoryPattern = patterns.find(p => p.category === question.category);
      if (categoryPattern) {
        if (categoryPattern.avg_score < 3) {
          score += 20; // Boost struggling areas
        }
        if (categoryPattern.trend_direction === 'declining') {
          score += 15;
        }
        if (categoryPattern.question_frequency > 5) {
          score -= 10; // Reduce over-asked categories
        }
      }

      // Frequency considerations
      const daysSinceLastResponse = this.getDaysSinceLastResponse(
        recentResponses, 
        question.id
      );
      
      if (question.frequency_type === 'daily' && daysSinceLastResponse < 1) {
        score -= 50;
      } else if (question.frequency_type === 'weekly' && daysSinceLastResponse < 7) {
        score -= 30;
      }

      return { ...question, relevanceScore: score };
    }).filter(q => (q.relevanceScore || 0) > 0);
  }

  private async getUserPreferences(userId: string): Promise<UserPreferences | null> {
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

  private async getRecentResponses(userId: string) {
    const { data, error } = await supabase
      .from("question_responses")
      .select(`
        *,
        assessment_questions(category, target_focus_areas)
      `)
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error("Error fetching recent responses:", error);
      return [];
    }

    return data || [];
  }

  private async getAssessmentPatterns(userId: string): Promise<AssessmentPattern[]> {
    const { data, error } = await supabase
      .from("assessment_patterns")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching assessment patterns:", error);
      return [];
    }

    return (data || []).map(item => ({
      category: item.category,
      avg_score: item.avg_score || 0,
      trend_direction: this.mapTrendDirection(item.trend_direction || 'stable'),
      question_frequency: item.question_frequency || 0
    }));
  }

  private mapTrendDirection(direction: string): 'declining' | 'improving' | 'stable' {
    switch (direction) {
      case 'declining': return 'declining';
      case 'improving': return 'improving';
      case 'stable': return 'stable';
      default: return 'stable';
    }
  }

  private getDaysSinceLastResponse(responses: any[], questionId: string): number {
    const lastResponse = responses
      .filter(r => r.question_id === questionId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

    if (!lastResponse) return 999;

    const daysDiff = Math.floor(
      (Date.now() - new Date(lastResponse.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysDiff;
  }
}

export const advancedQuestionSelector = new AdvancedQuestionSelector();
