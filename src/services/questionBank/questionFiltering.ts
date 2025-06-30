
import { QuestionTemplate } from "./questionCategories";
import { DynamicQuestionContext } from "./dynamicTypes";

export class QuestionFilteringService {
  filterQuestionsByContext(context: DynamicQuestionContext, questions: QuestionTemplate[]): QuestionTemplate[] {
    return questions.filter(question => {
      // Filter by focus areas
      const focusAreaMatch = question.target_focus_areas.some(area => 
        context.focusAreas.includes(area)
      );
      
      // Filter by frequency (check if question should be asked today)
      const frequencyMatch = this.shouldAskToday(question, context);
      
      // Filter by triggers
      const triggerMatch = this.checkTriggers(question, context);
      
      return focusAreaMatch && frequencyMatch && triggerMatch;
    });
  }

  private shouldAskToday(question: QuestionTemplate, context: DynamicQuestionContext): boolean {
    const lastAsked = this.getLastAskedDate(question.id, context.recentResponses);
    const daysSinceAsked = lastAsked ? this.getDaysDifference(lastAsked, new Date()) : 999;
    
    switch (question.frequency_type) {
      case 'daily':
        return daysSinceAsked >= 1;
      case 'weekly':
        return daysSinceAsked >= 7;
      case 'bi-weekly':
        return daysSinceAsked >= 14;
      case 'contextual':
        return true; // Contextual questions are always available
      default:
        return true;
    }
  }

  private checkTriggers(question: QuestionTemplate, context: DynamicQuestionContext): boolean {
    if (!question.triggers) return true;
    
    const triggers = question.triggers;
    
    // Check mood threshold
    if (triggers.mood_threshold !== undefined) {
      const avgMood = context.recentMoodScores.length > 0 
        ? context.recentMoodScores.reduce((a, b) => a + b, 0) / context.recentMoodScores.length 
        : 3;
      if (avgMood > triggers.mood_threshold) return false;
    }
    
    // Check stress threshold
    if (triggers.stress_threshold !== undefined) {
      const avgStress = context.recentStressLevels.length > 0
        ? context.recentStressLevels.reduce((a, b) => a + b, 0) / context.recentStressLevels.length
        : 3;
      if (avgStress < triggers.stress_threshold) return false;
    }
    
    // Check keywords
    if (triggers.keywords && triggers.keywords.length > 0) {
      const hasKeywordMatch = triggers.keywords.some(keyword =>
        context.journalKeywords.some(journalKeyword =>
          journalKeyword.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      if (!hasKeywordMatch) return false;
    }
    
    return true;
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

export const questionFilteringService = new QuestionFilteringService();
