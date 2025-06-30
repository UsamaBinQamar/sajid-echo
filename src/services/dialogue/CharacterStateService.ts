
export interface CharacterState {
  name: string;
  role: string;
  personality: string;
  emotional_state: string;
  background: string;
}

export class CharacterStateService {
  static updateEmotionalState(
    currentState: CharacterState,
    empathyScore: number
  ): CharacterState {
    let newEmotionalState = currentState.emotional_state;

    if (empathyScore >= 4) {
      newEmotionalState = "becoming more receptive and trusting";
    } else if (empathyScore <= 2) {
      newEmotionalState = "feeling more defensive and hurt";
    }

    return {
      ...currentState,
      emotional_state: newEmotionalState
    };
  }

  static getCharacterResponse(
    userMessage: string,
    characterState: CharacterState,
    scenarioSetup: string,
    exchangeNumber: number
  ): Promise<string | null> {
    // This delegates to the existing openAI service
    const { openAIService } = require("@/services/ai/openAIService");
    
    return openAIService.generateDialogueResponse(
      userMessage,
      characterState,
      scenarioSetup,
      exchangeNumber
    );
  }

  static validateCharacterState(state: any): state is CharacterState {
    return (
      state &&
      typeof state.name === 'string' &&
      typeof state.role === 'string' &&
      typeof state.personality === 'string' &&
      typeof state.emotional_state === 'string' &&
      typeof state.background === 'string'
    );
  }
}
