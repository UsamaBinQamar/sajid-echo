
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface CoachingInterventionProps {
  intervention: {
    id: string;
    intervention_content: string;
  };
  onDismiss: () => void;
}

const CoachingIntervention: React.FC<CoachingInterventionProps> = ({
  intervention,
  onDismiss
}) => {
  return (
    <Alert className="border-info bg-info-soft">
      <Lightbulb className="h-4 w-4 text-info" />
      <AlertDescription className="text-info">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium mb-1">💡 Coaching Moment</p>
            <p className="text-professional-sm">{intervention.intervention_content}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            ✕
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CoachingIntervention;
