
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Clock, Target, TrendingUp } from "lucide-react";

interface DialogueProgressHeaderProps {
  scenario: any;
  exchangeCount: number;
  averageScore: number;
  latestScores: {
    empathy_score: number;
    clarity_score: number;
    inclusion_score: number;
  } | null;
  onPause: () => void;
}

const DialogueProgressHeader: React.FC<DialogueProgressHeaderProps> = ({
  scenario,
  exchangeCount,
  averageScore,
  latestScores,
  onPause
}) => {
  const formatScore = (score: number) => Math.round(score * 100);

  return (
    <div className="card-ai p-6 glow-ai-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-ai-gradient mb-2">
            {scenario.title}
          </h2>
          <p className="text-muted-foreground">
            Speaking with <span className="text-primary font-medium">{scenario.character_persona?.name}</span>
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={onPause}
          className="btn-ai-primary flex items-center gap-2"
        >
          <Pause className="h-4 w-4" />
          Pause Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-ai p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Exchanges</span>
          </div>
          <div className="text-3xl font-bold text-primary">{exchangeCount}</div>
        </div>

        <div className="card-ai p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Average Score</span>
          </div>
          <div className="text-3xl font-bold text-accent">
            {formatScore(averageScore)}%
          </div>
        </div>

        {latestScores && (
          <>
            <div className="card-ai p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Latest Scores</span>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                  E: {formatScore(latestScores.empathy_score)}%
                </Badge>
                <Badge variant="outline" className="text-xs bg-accent/10 border-accent/30">
                  C: {formatScore(latestScores.clarity_score)}%
                </Badge>
                <Badge variant="outline" className="text-xs bg-secondary/10 border-secondary/30">
                  I: {formatScore(latestScores.inclusion_score)}%
                </Badge>
              </div>
            </div>

            <div className="card-ai p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${Math.min(formatScore(averageScore), 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatScore(averageScore)}% Complete
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DialogueProgressHeader;
