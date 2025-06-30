
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Heart, 
  Clock, 
  AlertTriangle,
  Trophy,
  Star
} from "lucide-react";
import { EnhancedScenario } from '../types';
import { getCategoryInfo } from '../utils/categoryMappings';

interface ScenarioCardProps {
  scenario: EnhancedScenario;
  onStartScenario: (scenarioId: string) => void;
}

const getIntensityLabel = (level: number) => {
  const labels = ['Very Light', 'Light', 'Moderate', 'Intense', 'Very Intense'];
  return labels[level - 1];
};

const getIntensityColor = (level: number) => {
  const colors = [
    'text-success', 
    'text-primary', 
    'text-accent', 
    'text-orange-400', 
    'text-destructive'
  ];
  return colors[level - 1];
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onStartScenario }) => {
  const categoryInfo = getCategoryInfo(scenario.category);

  return (
    <Card className="group card-ai hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 rounded-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2 p-3">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-base font-semibold text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {scenario.title}
          </CardTitle>
          {scenario.user_progress && scenario.user_progress.completion_count > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-accent/20 text-accent border-accent/30 ml-2 flex-shrink-0">
              <Trophy className="h-3 w-3" />
              {scenario.user_progress.completion_count}
            </Badge>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-0.5 border ${categoryInfo.color}`}
            title={categoryInfo.description}
          >
            {categoryInfo.label}
          </Badge>
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-xs px-2 py-0.5">
            L{scenario.difficulty_level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 p-3 flex-1 flex flex-col">
        <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm flex-shrink-0">{scenario.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs flex-shrink-0">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{scenario.estimated_duration_minutes}min</span>
          </div>
          <div className={`flex items-center gap-1 ${getIntensityColor(scenario.emotional_intensity_level)}`}>
            <Heart className="h-3 w-3" />
            <span className="truncate">{getIntensityLabel(scenario.emotional_intensity_level)}</span>
          </div>
        </div>

        {scenario.trigger_warnings && scenario.trigger_warnings.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-orange-400 bg-[#8A1503]/10 border border-[#8A1503]/20 rounded-md px-2 py-1 flex-shrink-0">
            <AlertTriangle className="h-3 w-3" />
            <span>Content notice</span>
          </div>
        )}

        {scenario.user_progress && scenario.user_progress.completion_count > 0 && (
          <div className="space-y-1 bg-muted/30 rounded-md p-2 flex-shrink-0">
            <div className="text-xs font-medium text-primary">Progress</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Empathy</span>
                <span>{Math.round(scenario.user_progress.best_empathy_score * 100)}%</span>
              </div>
              <Progress value={scenario.user_progress.best_empathy_score * 100} className="h-1.5 bg-muted" />
            </div>
          </div>
        )}

        <div className="flex gap-1 flex-wrap flex-shrink-0">
          {scenario.focus_areas?.slice(0, 2).map((area, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-muted text-muted-foreground border-border px-1.5 py-0.5">
              {area.replace('_', ' ')}
            </Badge>
          ))}
          {scenario.focus_areas && scenario.focus_areas.length > 2 && (
            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground border-border px-1.5 py-0.5">
              +{scenario.focus_areas.length - 2}
            </Badge>
          )}
        </div>

        <Button 
          onClick={() => onStartScenario(scenario.id)}
          className={`w-full font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 mt-auto ${
            scenario.user_progress && scenario.user_progress.completion_count > 0 
              ? "btn-ai-primary" 
              : "btn-ai-primary"
          }`}
          size="sm"
        >
          {scenario.user_progress && scenario.user_progress.completion_count > 0 ? (
            <>
              <Star className="h-4 w-4 mr-1" />
              Practice Again
            </>
          ) : (
            <>
              <Users className="h-4 w-4 mr-1" />
              Start Practice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
