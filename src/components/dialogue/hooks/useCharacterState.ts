
import { useState } from 'react';
import { CharacterStateService, CharacterState } from "@/services/dialogue";

export const useCharacterState = (initialCharacterState: any) => {
  const [aiCharacterState, setAiCharacterState] = useState<CharacterState>(initialCharacterState);

  const updateCharacterBasedOnScore = (empathyScore: number) => {
    setAiCharacterState(prev => 
      CharacterStateService.updateEmotionalState(prev, empathyScore)
    );
  };

  return {
    aiCharacterState,
    updateCharacterBasedOnScore
  };
};
