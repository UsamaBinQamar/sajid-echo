
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DailyReflection } from "@/services/insights/dailyReflectionService";

interface DailyReflectionCardProps {
  reflection: DailyReflection;
  showDetails?: boolean;
}

const DailyReflectionCard: React.FC<DailyReflectionCardProps> = ({ 
  reflection, 
  showDetails = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getToneColor = (tone: DailyReflection['emotionalTone']) => {
    switch (tone) {
      case 'breakthrough': return 'bg-green-100 text-[#37654B] border-green-300';
      case 'growth': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'steady': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'challenging': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'difficult': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getToneIcon = (tone: DailyReflection['emotionalTone']) => {
    switch (tone) {
      case 'breakthrough': return '🌟';
      case 'growth': return '📈';
      case 'steady': return '🎯';
      case 'challenging': return '💪';
      case 'difficult': return '🤲';
      default: return '💭';
    }
  };

  return (
    <Card className={`p-4 border ${getToneColor(reflection.emotionalTone)}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{getToneIcon(reflection.emotionalTone)}</span>
              <Badge variant="outline" className="text-xs">
                {new Date(reflection.date).toLocaleDateString()}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {reflection.type === 'checkin' ? 'Check-in' : 'Assessment'}
              </Badge>
            </div>
            
            <p className="text-sm font-medium text-gray-800 leading-relaxed">
              {reflection.reflectionText}
            </p>
            
            {reflection.growthInsight && (
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-700">{reflection.growthInsight}</span>
              </div>
            )}
            
            {reflection.coachingSuggestion && (
              <div className="flex items-center space-x-1 mt-2">
                <Lightbulb className="h-3 w-3 text-amber-600" />
                <span className="text-xs text-amber-700">{reflection.coachingSuggestion}</span>
              </div>
            )}
          </div>
          
          {showDetails && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="text-xs text-gray-600 space-y-1 border-t pt-2">
                  <div className="flex justify-between">
                    <span>Responses:</span>
                    <span>{reflection.responses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span>{reflection.averageScore.toFixed(1)}/5</span>
                  </div>
                  {reflection.categories.length > 0 && (
                    <div className="flex justify-between">
                      <span>Areas:</span>
                      <span className="text-right">{reflection.categories.join(', ')}</span>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DailyReflectionCard;
