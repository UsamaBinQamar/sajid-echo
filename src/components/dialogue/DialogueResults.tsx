
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDialogueAssessment } from './hooks/useDialogueAssessment';
import ResultsHeader from './components/ResultsHeader';
import ScoreCards from './components/ScoreCards';
import StrengthsSection from './components/StrengthsSection';
import ImprovementSection from './components/ImprovementSection';
import ReflectionSection from './components/ReflectionSection';
import AchievementBadges from './components/AchievementBadges';
import ResultsActions from './components/ResultsActions';

interface DialogueSession {
  id: string;
  scenario_id: string;
}

interface DialogueResultsProps {
  session: DialogueSession;
  onReturnToScenarios: () => void;
}

const DialogueResults: React.FC<DialogueResultsProps> = ({ session, onReturnToScenarios }) => {
  const navigate = useNavigate();
  const { assessment, isLoading, saveToJournal } = useDialogueAssessment(session.id);

  const handleSaveToJournal = async () => {
    const success = await saveToJournal();
    if (success) {
      navigate('/journal');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading results...</div>;
  }

  if (!assessment) {
    return <div className="container mx-auto p-6">Assessment not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <ResultsHeader />
      
      <ScoreCards 
        empathyScore={assessment.overall_empathy_score}
        clarityScore={assessment.overall_clarity_score}
        inclusionScore={assessment.overall_inclusion_score}
      />

      <StrengthsSection strengths={assessment.strengths} />

      <ImprovementSection improvementAreas={assessment.improvement_areas} />

      <ReflectionSection 
        journalPrompt={assessment.journal_prompt}
        onSaveToJournal={handleSaveToJournal}
      />

      <AchievementBadges badges={assessment.achievement_badges} />

      <ResultsActions onReturnToScenarios={onReturnToScenarios} />
    </div>
  );
};

export default DialogueResults;
