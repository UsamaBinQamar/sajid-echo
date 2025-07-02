
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { smartPersonalizationService } from "@/services/personalization";
import { Bell, Clock, TrendingUp } from "lucide-react";

const SmartNotifications = () => {
  const [timingRec, setTimingRec] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSmartRecommendations();
  }, []);

  const loadSmartRecommendations = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [timing, growthInsights] = await Promise.all([
        smartPersonalizationService.getOptimalTimingRecommendations(session.user.id),
        smartPersonalizationService.generateGrowthRecommendations(session.user.id)
      ]);

      setTimingRec(timing);
      setInsights(growthInsights.slice(0, 2)); // Show top 2 insights
    } catch (error) {
      console.error("Error loading smart recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const isOptimalTime = () => {
    return getCurrentTimeOfDay() === timingRec?.preferredTime;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-600" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timing Recommendation */}
        {timingRec && timingRec.confidence > 0.5 && (
          <div className="p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-foreground">Optimal Timing</span>
              </div>
              {isOptimalTime() && (
                <Badge className="bg-green-100 text-[#37654B]">
                  Perfect time! ⭐
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              You tend to provide better responses in the {timingRec.preferredTime}
            </p>
          </div>
        )}

        {/* Priority Insights */}
        {insights.filter(i => i.confidence > 0.7).map((insight, index) => (
          <div key={index} className="p-3 rounded-lg border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-[#f3c012]" />
              <span className="text-sm font-medium text-foreground">Growth Insight</span>
              <Badge variant="outline" className="text-xs">
                {Math.round(insight.confidence * 100)}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{insight.message}</p>
          </div>
        ))}

        {insights.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keep using the app to unlock smart recommendations!
          </p>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadSmartRecommendations}
          className="w-full text-xs"
        >
          Refresh Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartNotifications;
