
import { QuestionTemplate } from "./questionCategories";
import { DynamicQuestionContext } from "./dynamicTypes";

export class QuestionSelectionService {
  selectDiverseQuestions(
    scoredQuestions: Array<QuestionTemplate & { relevanceScore: number }>,
    maxQuestions: number
  ): QuestionTemplate[] {
    const sorted = scoredQuestions.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selected: QuestionTemplate[] = [];
    const usedCategories = new Set<string>();
    
    // First pass: select highest scoring questions from different categories
    for (const question of sorted) {
      if (selected.length >= maxQuestions) break;
      
      if (!usedCategories.has(question.category) || selected.length < maxQuestions / 2) {
        selected.push(question);
        usedCategories.add(question.category);
      }
    }
    
    // Second pass: fill remaining slots with highest scoring questions
    for (const question of sorted) {
      if (selected.length >= maxQuestions) break;
      
      if (!selected.includes(question)) {
        selected.push(question);
      }
    }
    
    return selected;
  }
}

export const questionSelectionService = new QuestionSelectionService();
