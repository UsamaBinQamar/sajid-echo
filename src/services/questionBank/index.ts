
export { DynamicQuestionGenerator, dynamicQuestionGenerator } from './dynamicGenerator';
export { ContextAnalyzer, contextAnalyzer } from './contextAnalyzer';
export { EXPANDED_QUESTION_BANK, QUESTION_CATEGORIES } from './questionCategories';
export type { QuestionTemplate } from './questionCategories';
export type { DynamicQuestionContext } from './dynamicTypes';
export { questionScoringService } from './questionScoring';
export { questionFilteringService } from './questionFiltering';
export { questionSelectionService } from './questionSelection';
export { questionVariationService } from './questionVariations';

// Phase 2 additions
export { SmartQuestionRotation } from './smartQuestionRotation';
export { EnhancedQuestionPool } from './enhancedQuestionPool';
export type { QuestionRotationContext } from './smartQuestionRotation';
export type { EnhancedQuestionMetadata, EnhancedSmartQuestion } from './enhancedQuestionPool';
