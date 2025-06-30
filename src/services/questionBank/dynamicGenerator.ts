
import { EXPANDED_QUESTION_BANK, QuestionTemplate } from "./questionCategories";
import type { DynamicQuestionContext } from "./dynamicTypes";
import { questionFilteringService } from "./questionFiltering";
import { questionScoringService } from "./questionScoring";
import { questionSelectionService } from "./questionSelection";
import { questionVariationService } from "./questionVariations";

export class DynamicQuestionGenerator {
  async generateContextualQuestions(
    context: DynamicQuestionContext,
    maxQuestions: number = 3
  ): Promise<QuestionTemplate[]> {
    console.log('Generating contextual questions for context:', context);
    
    const availableQuestions = questionFilteringService.filterQuestionsByContext(context, EXPANDED_QUESTION_BANK);
    const scoredQuestions = questionScoringService.scoreQuestionsByRelevance(availableQuestions, context);
    
    // Add variety by including different categories
    const selectedQuestions = questionSelectionService.selectDiverseQuestions(scoredQuestions, maxQuestions);
    
    // Apply question variations for freshness
    return questionVariationService.applyQuestionVariations(selectedQuestions, context);
  }
}

export const dynamicQuestionGenerator = new DynamicQuestionGenerator();
