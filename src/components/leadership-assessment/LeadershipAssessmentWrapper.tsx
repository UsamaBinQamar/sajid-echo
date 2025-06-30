
import React, { useState } from 'react';
import { LeadershipAssessmentType } from "@/services/leadershipAssessment/types";
import LeadershipAssessmentCard from './LeadershipAssessmentCard';
import LeadershipAssessmentRenderer from './LeadershipAssessmentRenderer';

const LeadershipAssessmentWrapper: React.FC = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<LeadershipAssessmentType | null>(null);

  const handleStartAssessment = (assessmentType: LeadershipAssessmentType) => {
    setSelectedAssessment(assessmentType);
  };

  const handleComplete = () => {
    setSelectedAssessment(null);
  };

  const handleBack = () => {
    setSelectedAssessment(null);
  };

  if (selectedAssessment) {
    return (
      <LeadershipAssessmentRenderer
        assessmentType={selectedAssessment}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    );
  }

  return (
    <LeadershipAssessmentCard onStartAssessment={handleStartAssessment} />
  );
};

export default LeadershipAssessmentWrapper;
