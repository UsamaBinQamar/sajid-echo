
import { baseOpenAIService } from "./core/BaseOpenAIService";
import { dialogueResponseService } from "./dialogue/DialogueResponseService";
import { analysisService } from "./analysis/AnalysisService";
import { coachingInterventionService } from "./coaching/CoachingInterventionService";

class OpenAIService {
  // Core completion functionality
  async generateCompletion(prompt: string, systemMessage?: string, temperature: number = 0.7) {
    return baseOpenAIService.generateCompletion(prompt, systemMessage, temperature);
  }

  // Dialogue-specific functionality
  async generateDialogueResponse(
    userMessage: string, 
    characterPersona: any, 
    scenarioContext: string,
    exchangeNumber: number,
    userContext?: any
  ) {
    return dialogueResponseService.generateDialogueResponse(
      userMessage,
      characterPersona,
      scenarioContext,
      exchangeNumber,
      userContext
    );
  }

  // Analysis functionality
  async analyzeUserResponse(userMessage: string, aiResponse: string, scenarioContext: string) {
    return analysisService.analyzeUserResponse(userMessage, aiResponse, scenarioContext);
  }

  async analyzeSentiment(text: string) {
    return analysisService.analyzeSentiment(text);
  }

  async generateEmbedding(text: string) {
    return analysisService.generateEmbedding(text);
  }

  // Coaching functionality
  async generateCoachingIntervention(scores: any, exchangeNumber: number, scenarioTitle: string) {
    return coachingInterventionService.generateCoachingIntervention(scores, exchangeNumber, scenarioTitle);
  }

  // Testing functionality
  async testConnection() {
    return baseOpenAIService.testConnection();
  }
}

export const openAIService = new OpenAIService();
