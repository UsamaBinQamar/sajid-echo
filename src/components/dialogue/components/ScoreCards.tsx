
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreCardsProps {
  empathyScore: number;
  clarityScore: number;
  inclusionScore: number;
}

const ScoreCards: React.FC<ScoreCardsProps> = ({ empathyScore, clarityScore, inclusionScore }) => {
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 4) return 'Strong';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Developing';
    return 'Needs Focus';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <TrendingUp className="h-4 w-4" aria-hidden="true" />;
    if (score >= 3) return <Minus className="h-4 w-4" aria-hidden="true" />;
    return <TrendingDown className="h-4 w-4" aria-hidden="true" />;
  };

  const getAriaLabel = (category: string, score: number, label: string) => {
    return `${category} score: ${score.toFixed(1)} out of 5, rated as ${label}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Communication skills scores">
      <Card className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div 
              className={`text-3xl font-bold rounded-full w-16 h-16 mx-auto flex items-center justify-center border-2 ${getScoreColor(empathyScore)}`}
              role="img"
              aria-label={getAriaLabel("Empathy", empathyScore, getScoreLabel(empathyScore))}
            >
              {empathyScore.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-semibold">Empathy</h3>
            {getScoreIcon(empathyScore)}
          </div>
          <p className="text-sm text-gray-600 font-medium" aria-label={`Performance level: ${getScoreLabel(empathyScore)}`}>
            {getScoreLabel(empathyScore)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Understanding and acknowledging emotions</p>
        </CardContent>
      </Card>

      <Card className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div 
              className={`text-3xl font-bold rounded-full w-16 h-16 mx-auto flex items-center justify-center border-2 ${getScoreColor(clarityScore)}`}
              role="img"
              aria-label={getAriaLabel("Clarity", clarityScore, getScoreLabel(clarityScore))}
            >
              {clarityScore.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-semibold">Clarity</h3>
            {getScoreIcon(clarityScore)}
          </div>
          <p className="text-sm text-gray-600 font-medium" aria-label={`Performance level: ${getScoreLabel(clarityScore)}`}>
            {getScoreLabel(clarityScore)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Clear and direct communication</p>
        </CardContent>
      </Card>

      <Card className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div 
              className={`text-3xl font-bold rounded-full w-16 h-16 mx-auto flex items-center justify-center border-2 ${getScoreColor(inclusionScore)}`}
              role="img"
              aria-label={getAriaLabel("Inclusion", inclusionScore, getScoreLabel(inclusionScore))}
            >
              {inclusionScore.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3 className="font-semibold">Inclusion</h3>
            {getScoreIcon(inclusionScore)}
          </div>
          <p className="text-sm text-gray-600 font-medium" aria-label={`Performance level: ${getScoreLabel(inclusionScore)}`}>
            {getScoreLabel(inclusionScore)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Creating inclusive dialogue</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreCards;
