
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Target, Users } from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
  learning_objectives: string[];
  cultural_context: string;
  power_dynamics: string;
  tags: string[];
}

interface ScenarioGridProps {
  scenarios: Scenario[];
  onStartScenario: (scenarioId: string) => void;
}

const ScenarioGrid: React.FC<ScenarioGridProps> = ({ scenarios, onStartScenario }) => {
  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return { label: 'Beginner', color: 'bg-green-100 text-[#37654B]' };
      case 2: return { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' };
      case 3: return { label: 'Advanced', color: 'bg-red-100 text-red-800' };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'power_identity_politics': 'Power & Identity',
      'authentic_leadership': 'Authentic Leadership',
      'boundaries_burnout': 'Boundaries & Burnout',
      'inclusive_leadership': 'Inclusive Leadership',
      'managing_relationships': 'Managing Relationships',
      'communication_feedback': 'Communication & Feedback',
      'leading_change': 'Leading Change',
      'resilience_reflection': 'Resilience & Reflection'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenarios.map((scenario) => {
        const difficulty = getDifficultyLabel(scenario.difficulty_level);
        
        return (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{scenario.title}</CardTitle>
                <Badge className={difficulty.color}>{difficulty.label}</Badge>
              </div>
              <Badge variant="outline" className="w-fit">
                {getCategoryLabel(scenario.category)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-3">{scenario.description}</p>
              
              {scenario.cultural_context && (
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-500">{scenario.cultural_context}</p>
                </div>
              )}

              {scenario.learning_objectives && scenario.learning_objectives.length > 0 && (
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Learning objectives:</span>
                    <ul className="mt-1 space-y-1">
                      {scenario.learning_objectives.slice(0, 3).map((objective, index) => (
                        <li key={index}>• {objective}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>10-15 min</span>
                </div>
                <Button 
                  onClick={() => onStartScenario(scenario.id)}
                  className="bg-[#f3c012] hover:bg-purple-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              </div>

              {scenario.tags && scenario.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {scenario.tags.slice(0, 4).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ScenarioGrid;
