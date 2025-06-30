import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { predictiveAnalyticsService, PredictiveInsight } from "@/services/predictiveAnalytics";
import { useNavigate } from "react-router-dom";
import { Brain, AlertTriangle, TrendingUp, Lightbulb, ArrowRight } from "lucide-react";

const PredictiveInsightsWidget = () => {
  const [topInsights, setTopInsights] = useState<PredictiveInsight[]>([]);
  const [burnoutRisk, setBurnoutRisk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopInsights();
  }, []);

  const loadTopInsights = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [insights, burnoutAnalysis] = await Promise.all([
        predictiveAnalyticsService.generatePredictiveInsights(session.user.id),
        predictiveAnalyticsService.getBurnoutRisk(session.user.id)
      ]);

      // Get top 2 highest confidence insights
      setTopInsights(insights.slice(0, 2));
      setBurnoutRisk(burnoutAnalysis);
    } catch (error) {
      console.error("Error loading predictive insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string, severity?: string) => {
    if (type === 'warning') {
      if (severity === 'high') return "bg-red-50 border-red-200 text-red-800";
      if (severity === 'medium') return "bg-orange-50 border-orange-200 text-orange-800";
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    }
    if (type === 'improvement') return "bg-green-50 border-green-200 text-[#37654B]";
    return "bg-blue-50 border-blue-200 text-blue-800";
  };

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return "bg-red-100 text-red-800";
      case 'medium': return "bg-orange-100 text-orange-800";
      default: return "bg-green-100 text-[#37654B]";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-[#CEA358]" />
            AI Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CEA358]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show if no insights and low risk
  if (topInsights.length === 0 && burnoutRisk?.risk === 'low') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-[#CEA358]" />
            AI Predictions
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/insights?tab=predictive")}
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Burnout Risk Alert */}
        {burnoutRisk && burnoutRisk.risk !== 'low' && (
          <div className={`p-3 rounded-lg border ${getBurnoutRiskColor(burnoutRisk.risk)}`}>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium text-sm">
                {burnoutRisk.risk.toUpperCase()} Burnout Risk
              </span>
            </div>
            <p className="text-xs">
              {burnoutRisk.recommendations[0]}
            </p>
          </div>
        )}

        {/* Top Insights */}
        {topInsights.map((insight, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border ${getInsightColor(insight.type, insight.severity)}`}
          >
            <div className="flex items-start space-x-2">
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <p className="text-xs font-medium mb-1">{insight.message}</p>
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

        {topInsights.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Keep using the app to unlock predictions!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveInsightsWidget;
