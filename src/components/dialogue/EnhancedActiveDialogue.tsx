
import React, { useState, useRef } from 'react';
import { useDialogueSession } from './hooks/useDialogueSession';
import DialogueProgressHeader from './components/DialogueProgressHeader';
import DialogueMessages from './components/DialogueMessages';
import ResponseInput from './components/ResponseInput';
import CoachingIntervention from './components/CoachingIntervention';
import PreparationPhase from './PreparationPhase';

interface EnhancedActiveDialogueProps {
  scenario: any;
  sessionId: string;
  onComplete: () => void;
  onPause: () => void;
}

const EnhancedActiveDialogue: React.FC<EnhancedActiveDialogueProps> = ({
  scenario,
  sessionId,
  onComplete,
  onPause
}) => {
  const [showPreparation, setShowPreparation] = useState(true);
  const [intervention, setIntervention] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    exchanges,
    currentResponse,
    setCurrentResponse,
    isLoading,
    aiCharacterState,
    handleSendMessage
  } = useDialogueSession(sessionId, scenario);

  const handleStartDialogue = () => {
    setShowPreparation(false);
  };

  const handleSendWithIntervention = async () => {
    const newIntervention = await handleSendMessage(onComplete);
    if (newIntervention) {
      setIntervention(newIntervention);
    }
  };

  const dismissIntervention = () => {
    setIntervention(null);
  };

  // Calculate average score and latest scores for the header
  const calculateScores = () => {
    if (exchanges.length === 0) {
      return { averageScore: 0, latestScores: null };
    }

    const latestExchange = exchanges[exchanges.length - 1];
    const latestScores = {
      empathy_score: latestExchange.empathy_score,
      clarity_score: latestExchange.clarity_score,
      inclusion_score: latestExchange.inclusion_score
    };

    const totalScores = exchanges.reduce((acc, exchange) => ({
      empathy: acc.empathy + exchange.empathy_score,
      clarity: acc.clarity + exchange.clarity_score,
      inclusion: acc.inclusion + exchange.inclusion_score
    }), { empathy: 0, clarity: 0, inclusion: 0 });

    const averageScore = (totalScores.empathy + totalScores.clarity + totalScores.inclusion) / (exchanges.length * 3);

    return { averageScore, latestScores };
  };

  const { averageScore, latestScores } = calculateScores();

  if (showPreparation) {
    return (
      <PreparationPhase 
        scenario={scenario}
        onStartDialogue={handleStartDialogue}
      />
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <DialogueProgressHeader 
        scenario={scenario}
        exchangeCount={exchanges.length}
        averageScore={averageScore}
        latestScores={latestScores}
        onPause={onPause}
      />

      <div className="flex-1 overflow-hidden flex flex-col space-y-6 p-6">
        {intervention && (
          <CoachingIntervention 
            intervention={intervention}
            onDismiss={dismissIntervention}
          />
        )}

        <DialogueMessages 
          exchanges={exchanges}
          scenario={scenario}
          aiCharacterState={aiCharacterState}
          messagesEndRef={messagesEndRef}
        />

        <ResponseInput
          currentResponse={currentResponse}
          setCurrentResponse={setCurrentResponse}
          onSendMessage={handleSendWithIntervention}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EnhancedActiveDialogue;
