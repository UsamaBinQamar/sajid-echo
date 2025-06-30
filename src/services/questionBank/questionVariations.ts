
import { QuestionTemplate } from "./questionCategories";
import { DynamicQuestionContext } from "./dynamicTypes";

export class QuestionVariationService {
  applyQuestionVariations(
    questions: QuestionTemplate[],
    context: DynamicQuestionContext
  ): QuestionTemplate[] {
    return questions.map(question => {
      if (question.variations && question.variations.length > 0) {
        // Use a deterministic but varied approach to select variations
        const hash = this.simpleHash(context.userId + question.id + new Date().toDateString());
        const variationIndex = hash % (question.variations.length + 1);
        
        if (variationIndex > 0) {
          return {
            ...question,
            question_text: question.variations[variationIndex - 1]
          };
        }
      }
      
      return question;
    });
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

export const questionVariationService = new QuestionVariationService();
