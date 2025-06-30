
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  AlertTriangle,
  Trophy,
  Star,
  BookOpen,
  Shield
} from "lucide-react";
import { EnhancedScenario } from '../types';
import { getCategoryInfo, getTagCategory, getComplexityInfo, getDurationCategory } from '../utils/categoryMappings';

interface ConsistentScenarioCardProps {
  scenario: EnhancedScenario;
  onStartScenario: (scenarioId: string) => void;
}

const ConsistentScenarioCard: React.FC<ConsistentScenarioCardProps> = ({ scenario, onStartScenario }) => {
  // Safely handle category info with fallback
  const categoryInfo = scenario.category ? getCategoryInfo(scenario.category) : {
    icon: '📝',
    label: 'General',
    color: 'border-gray-200 text-gray-700',
    description: 'General scenario'
  };

  const durationInfo = getDurationCategory(scenario.estimated_duration_minutes || 15);
  const complexityIndicators = getComplexityInfo(scenario);
  
  // Safely combine and prioritize tags from focus_areas and tags
  const focusAreas = Array.isArray(scenario.focus_areas) ? scenario.focus_areas : [];
  const tags = Array.isArray(scenario.tags) ? scenario.tags : [];
  const allTags = [...focusAreas, ...tags];
  const uniqueTags = [...new Set(allTags)].filter(tag => tag && typeof tag === 'string').slice(0, 4);

  // Safely handle trigger warnings
  const triggerWarnings = Array.isArray(scenario.trigger_warnings) ? scenario.trigger_warnings : [];

  return (
    <Card className="group card-ai hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 rounded-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3 p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-base font-semibold text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2 flex-1">
            {scenario.title || 'Untitled Scenario'}
          </CardTitle>
          {scenario.user_progress && scenario.user_progress.completion_count > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-accent/20 text-accent border-accent/30 ml-2 flex-shrink-0">
              <Trophy className="h-3 w-3" />
              {scenario.user_progress.completion_count}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-1 border flex items-center gap-1 ${categoryInfo.color}`}
            title={categoryInfo.description}
          >
            <span>{categoryInfo.icon}</span>
            {categoryInfo.label}
          </Badge>
          
          <Badge variant="outline" className={`text-xs px-2 py-1 ${durationInfo.color} bg-background border-current/20`}>
            <span className="mr-1">{durationInfo.icon}</span>
            {durationInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 p-4 flex-1 flex flex-col">
        <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm flex-shrink-0">
          {scenario.description || 'No description available.'}
        </p>

        {/* Context Information */}
        <div className="space-y-2 flex-shrink-0">
          {scenario.cultural_context && (
            <div className="text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-md px-2 py-1">
              <span className="font-medium">Cultural Context:</span> {scenario.cultural_context}
            </div>
          )}
          
          {scenario.power_dynamics && (
            <div className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-md px-2 py-1">
              <span className="font-medium">Power Dynamics:</span> {scenario.power_dynamics}
            </div>
          )}
        </div>

        {/* Duration and Complexity Indicators */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{scenario.estimated_duration_minutes || 15}min</span>
          </div>
          
          {complexityIndicators.length > 0 && (
            <div className="flex items-center gap-1 text-primary">
              <BookOpen className="h-3 w-3" />
              <span title={complexityIndicators.join(', ')}>
                {complexityIndicators.length} considerations
              </span>
            </div>
          )}
        </div>

        {/* Warning Indicators */}
        {triggerWarnings.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-md px-2 py-1 flex-shrink-0">
            <AlertTriangle className="h-3 w-3" />
            <span>Content considerations apply</span>
          </div>
        )}

        {/* Progress Section */}
        {scenario.user_progress && scenario.user_progress.completion_count > 0 && (
          <div className="space-y-2 bg-muted/30 rounded-md p-2 flex-shrink-0">
            <div className="text-xs font-medium text-primary flex items-center gap-1">
              <Star className="h-3 w-3" />
              Your Progress
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Best Performance</span>
                <span>{Math.round((scenario.user_progress.best_empathy_score || 0) * 100)}%</span>
              </div>
              <Progress value={(scenario.user_progress.best_empathy_score || 0) * 100} className="h-1.5 bg-muted" />
            </div>
          </div>
        )}

        {/* Enhanced Tags Section */}
        {uniqueTags.length > 0 && (
          <div className="flex gap-1 flex-wrap flex-shrink-0">
            {uniqueTags.map((tag, index) => {
              const tagCategory = getTagCategory(tag);
              return (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className={`text-xs px-2 py-0.5 ${tagCategory.color} border`}
                  title={`${tagCategory.label}: ${tag}`}
                >
                  {tag.replace(/[_-]/g, ' ')}
                </Badge>
              );
            })}
          </div>
        )}

        {/* Preparation Guidance Indicator */}
        {scenario.preparation_guidance && (
          <div className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 flex items-center gap-1 flex-shrink-0">
            <Shield className="h-3 w-3" />
            Preparation guidance available
          </div>
        )}

        {/* Action Button */}
        <Button 
          onClick={() => onStartScenario(scenario.id)}
          className="w-full font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 mt-auto btn-ai-primary"
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

export default ConsistentScenarioCard;
