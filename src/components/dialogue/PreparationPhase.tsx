
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import ScenarioPreparationCard from './components/ScenarioPreparationCard';

interface PreparationPhaseProps {
  scenario: any;
  onStartDialogue: () => void;
}

const PreparationPhase: React.FC<PreparationPhaseProps> = ({ scenario, onStartDialogue }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-100">
          {scenario.title}
        </h1>
        <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          {scenario.description}
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{scenario.estimated_duration_minutes} minutes</span>
          </div>
          <span>•</span>
          <span>Level {scenario.difficulty_level}</span>
        </div>
      </div>

      {/* Preparation Content */}
      <ScenarioPreparationCard scenario={scenario} />

      {/* Start Button */}
      <div className="text-center pt-6">
        <Button 
          onClick={onStartDialogue}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-400/25"
        >
          Begin Dialogue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default PreparationPhase;
