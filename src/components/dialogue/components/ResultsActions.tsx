
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultsActionsProps {
  onReturnToScenarios: () => void;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({ onReturnToScenarios }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button onClick={onReturnToScenarios} variant="outline" className="flex items-center">
        <RotateCcw className="h-4 w-4 mr-2" />
        Try Another Scenario
      </Button>
      <Button onClick={() => navigate('/dashboard')} className="flex items-center bg-purple-600 hover:bg-purple-700">
        <Home className="h-4 w-4 mr-2" />
        Return to Dashboard
      </Button>
    </div>
  );
};

export default ResultsActions;
