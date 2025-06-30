
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { predictiveAnalyticsService, PredictiveInsight, TrendPrediction } from "@/services/predictiveAnalytics";
import { useToast } from "@/components/ui/use-toast";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Brain } from "lucide-react";

const PredictiveAnalytics = () => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [predictions, setPredictions] = useState<TrendPrediction[]>([]);
  const [burnoutRisk, setBurnoutRisk] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPredictiveData();
  }, []);

  const loadPredictiveData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [predictiveInsights, trendPredictions, burnoutAnalysis] = await Promise.all([
        predictiveAnalyticsService.generatePredictiveInsights(session.user.id),
        predictiveAnalyticsService.getTrendPredictions(session.user.id),
        predictiveAnalyticsService.getBurnoutRisk(session.user.id)
      ]);

      setInsights(predictiveInsights);
      setPredictions(trendPredictions);
      setBurnoutRisk(burnoutAnalysis);
    } catch (error) {
      console.error("Error loading predictive data:", error);
      toast({
        title: "Error Loading Predictions",
        description: "Failed to load predictive analytics",
        variant: "destructive",
      });
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
      if (severity === 'high') return "bg-red-100 text-red-800 border-red-200";
      if (severity === 'medium') return "bg-orange-100 text-orange-800 border-orange-200";
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    if (type === 'improvement') return "bg-green-100 text-[#37654B] border-green-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return "bg-red-100 text-red-800 border-red-300";
      case 'medium': return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-green-100 text-[#37654B] border-green-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-[#CEA358]" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CEA358]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Burnout Risk Assessment */}
      {burnoutRisk && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Burnout Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Risk Level:</span>
                <Badge className={getBurnoutRiskColor(burnoutRisk.risk)}>
                  {burnoutRisk.risk.toUpperCase()} RISK
                </Badge>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    burnoutRisk.risk === 'high' ? 'bg-[#8A1503]' :
                    burnoutRisk.risk === 'medium' ? 'bg-[#8A1503]' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(burnoutRisk.score * 10, 100)}%` }}
                ></div>
              </div>

              {burnoutRisk.factors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Risk Factors:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {burnoutRisk.factors.map((factor: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-[#8A1503] rounded-full"></span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {burnoutRisk.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trend Predictions */}
      {predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              7-Day Trend Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(prediction.trend)}
                    <div>
                      <h4 className="font-medium">{prediction.category.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-500">
                        Current: {prediction.currentScore.toFixed(1)} → Predicted: {prediction.predictedScore.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {Math.round(prediction.confidence * 100)}% confident
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictive Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-[#CEA358]" />
            AI-Powered Insights
          </CardTitle>
          <p className="text-sm text-gray-600">
            Personalized predictions and recommendations based on your patterns
          </p>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Keep using the app regularly to unlock predictive insights! We need more data to generate accurate predictions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Alert key={index} className={`border ${getInsightColor(insight.type, insight.severity)}`}>
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <AlertDescription className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{insight.message}</p>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(insight.confidence * 100)}% confident
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600">Timeframe: {insight.timeframe}</p>
                        
                        {insight.actionItems.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium">Recommended Actions:</p>
                            <ul className="text-xs space-y-1">
                              {insight.actionItems.map((action, actionIndex) => (
                                <li key={actionIndex} className="flex items-center space-x-2">
                                  <span className="w-1 h-1 bg-current rounded-full opacity-60"></span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={loadPredictiveData}
              className="w-full"
            >
              Refresh Predictions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;
