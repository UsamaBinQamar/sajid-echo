

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, ArrowRight, Activity, Zap, CheckCircle, AlertCircle, Lock, Sparkles, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUnifiedInsights } from "@/hooks/useUnifiedInsights";
import OverviewProgress from "./OverviewProgress";
import OverviewStats from "./OverviewStats";
import DailyReflectionCard from "./DailyReflectionCard";
import { useState } from "react";

interface UnifiedInsightsCardProps {
  mode?: 'full' | 'compact' | 'live-only';
  showHeader?: boolean;
  showHistory?: boolean;
  className?: string;
}

const UnifiedInsightsCard: React.FC<UnifiedInsightsCardProps> = ({ 
  mode = 'full', 
  showHeader = true, 
  showHistory = false,
  className = ""
}) => {
  const { data, loading, lastUpdate, refresh } = useUnifiedInsights();
  const navigate = useNavigate();
  const [showAllInsights, setShowAllInsights] = useState(false);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suggestion': return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'trend': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <Zap className="h-4 w-4 text-[#CEA358]" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement': return "bg-green-50 border-green-200";
      case 'suggestion': return "bg-amber-50 border-amber-200";
      case 'trend': return "bg-blue-50 border-blue-200";
      default: return "bg-purple-50 border-purple-200";
    }
  };

  const handleGoToAssessment = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CEA358]"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">Start your wellness journey to unlock insights!</p>
          <Button onClick={handleGoToAssessment}>
            Complete First Assessment
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const displayedInsights = showAllInsights ? data.liveInsights : data.liveInsights.slice(0, 2);

  return (
    <Card className={`${mode === 'full' ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 dark:bg-black dark:bg-none' : ''} ${className}`}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#CEA358]" />
              {mode === 'live-only' ? 'Live Insights' : 'Smart Insights Dashboard'}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-[#CEA358] border-[#CEA358]">
                {data.daysActive} days active
              </Badge>
              {lastUpdate && (
                <Badge variant="outline" className="text-xs">
                  Updated: {lastUpdate}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-6">
        {mode === 'full' && (
          <>
            {/* Progress Overview */}
            <OverviewProgress progress={data.progress} nextMilestone={data.nextMilestone} />
            
            {/* Quick Stats */}
            <OverviewStats 
              totalResponses={data.totalResponses}
              currentStreak={data.currentStreak}
              hasDataToday={data.hasDataToday}
            />
          </>
        )}

        {/* Recent Reflections */}
        {showHistory && data.recentReflections.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <History className="h-4 w-4 mr-1 text-[#8A1503]" />
                Daily Reflections
              </h4>
              <Button variant="ghost" size="sm" onClick={() => navigate('/insights', { state: { tab: 'history' } })}>
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {data.recentReflections.slice(0, 3).map((reflection) => (
                <DailyReflectionCard 
                  key={reflection.id} 
                  reflection={reflection}
                  showDetails={true}
                />
              ))}
            </div>
          </div>
        )}

        {mode === 'full' && (
          <>
            {/* Call to Action */}
            {!data.hasDataToday && (
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-[#8A1503]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#8A1503]">
                      Complete today's check-in to continue building insights
                    </p>
                    <p className="text-xs text-[#8A1503]">
                      Daily consistency unlocks more powerful analytics
                    </p>
                  </div>
                  <Button size="sm" onClick={handleGoToAssessment}>
                    Check In
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedInsightsCard;

