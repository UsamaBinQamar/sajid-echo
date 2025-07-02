import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { aiEngineService } from "@/services/ai";
import { useNavigate } from "react-router-dom";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";

const AIInsightsWidget = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const extractedInsights = await aiEngineService.extractInsights(session.user.id, 7);
      setInsights(extractedInsights.slice(0, 2)); // Show top 2 insights
    } catch (error) {
      console.error("Error loading AI insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'emotional': return <Brain className="h-4 w-4" />;
      case 'behavioral': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return "bg-red-50 border-red-200 text-red-800";
      case 'high': return "bg-orange-50 border-orange-200 text-orange-800";
      case 'medium': return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default: return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-[#f3c012]" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f3c012]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-[#f3c012]" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground py-4">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Keep journaling to unlock AI insights!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-[#f3c012]" />
            AI Insights
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/insights?tab=ai")}
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={insight.id || index} 
            className={`p-3 rounded-lg border ${getUrgencyColor(insight.urgency)}`}
          >
            <div className="flex items-start space-x-2">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{insight.message}</p>
                
                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1">Recommendations:</p>
                    <ul className="text-xs space-y-1">
                      {insight.recommendations.slice(0, 2).map((rec: string, recIndex: number) => (
                        <li key={recIndex} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {insight.timeframe}
                  </Badge>
                  <span className="text-xs opacity-70">
                    {Math.round(insight.confidence * 100)}% confident
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadAIInsights}
          className="w-full text-xs"
        >
          Refresh Insights
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;
