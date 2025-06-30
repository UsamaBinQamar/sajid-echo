
import { QuestionTemplate } from "./questionCategories";
import { DynamicQuestionContext } from "./dynamicTypes";

export class QuestionScoringService {
  scoreQuestionsByRelevance(
    questions: QuestionTemplate[], 
    context: DynamicQuestionContext
  ): Array<QuestionTemplate & { relevanceScore: number }> {
    return questions.map(question => {
      let score = 0;
      
      // Base priority score
      score += (4 - question.priority_level) * 10;
      
      // Time-based relevance
      score += this.getTimeBasedScore(question, context);
      
      // Recent response patterns
      score += this.getResponsePatternScore(question, context);
      
      // Focus area alignment
      const focusAreaOverlap = question.target_focus_areas.filter(area =>
        context.focusAreas.includes(area)
      ).length;
      score += focusAreaOverlap * 15;
      
      // Freshness bonus (haven't asked recently)
      const daysSinceAsked = this.getDaysSinceLastAsked(question.id, context.recentResponses);
      if (daysSinceAsked > 7) score += 10;
      if (daysSinceAsked > 14) score += 20;
      
      return { ...question, relevanceScore: score };
    });
  }

  private getTimeBasedScore(question: QuestionTemplate, context: DynamicQuestionContext): number {
    let score = 0;
    
    // Time of day preferences
    if (context.timeOfDay === 'morning' && question.category === 'sleep_recovery') {
      score += 15;
    }
    if (context.timeOfDay === 'evening' && question.category === 'mindfulness') {
      score += 10;
    }
    
    // Day of week preferences
    if (context.dayOfWeek === 'Monday' && question.category === 'work_boundaries') {
      score += 10;
    }
    if (['Saturday', 'Sunday'].includes(context.dayOfWeek) && 
        question.category === 'personal_growth') {
      score += 10;
    }
    
    return score;
  }

  private getResponsePatternScore(question: QuestionTemplate, context: DynamicQuestionContext): number {
    // Analyze recent responses to similar category questions
    const categoryResponses = context.recentResponses.filter(response =>
      response.assessment_questions?.category === question.category
    );
    
    if (categoryResponses.length === 0) return 5; // Bonus for unexplored categories
    
    const avgScore = categoryResponses.reduce((sum, response) => 
      sum + response.response_score, 0) / categoryResponses.length;
    
    // Boost questions in categories where user is struggling
    if (avgScore < 3) return 20;
    if (avgScore > 4) return -5; // Slightly reduce for areas doing well
    
    return 0;
  }

  private getDaysSinceLastAsked(questionId: string, recentResponses: any[]): number {
    const lastAsked = this.getLastAskedDate(questionId, recentResponses);
    return lastAsked ? this.getDaysDifference(lastAsked, new Date()) : 999;
  }

  private getLastAskedDate(questionId: string, recentResponses: any[]): Date | null {
    const response = recentResponses.find(r => r.question_id === questionId);
    return response ? new Date(response.created_at) : null;
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const questionScoringService = new QuestionScoringService();
