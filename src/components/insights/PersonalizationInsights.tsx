
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Brain, TrendingUp, Target, Lightbulb, Clock, BarChart3 } from "lucide-react";
import { useEnhancedInsights } from "./enhanced/useEnhancedInsights";
import AdvancedInsightsCard from "./enhanced/AdvancedInsightsCard";

interface PersonalizationData {
  daysActive: number;
  totalResponses: number;
  insights: any[];
  patterns: any[];
  recommendations: any[];
  insightLevel: 'patterns' | 'trends';
}

const PersonalizationInsights = () => {
  const { insights: enhancedInsights, loading: enhancedLoading, daysActive } = useEnhancedInsights();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enhancedLoading) {
      setLoading(false);
    }
  }, [enhancedLoading]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3c012]"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (daysActive === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
        <p className="text-gray-600">Complete some assessments to start seeing insights!</p>
      </div>
    );
  }

  const insightLevel = daysActive >= 15 ? 'trends' : 'patterns';

  return (
    <div className="space-y-6">
      {/* Insight Level Header */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              {insightLevel === 'trends' ? (
                <Brain className="h-5 w-5 mr-2 text-[#f3c012]" />
              ) : (
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              )}
              {insightLevel === 'trends' ? 'AI-Powered Trend Analysis' : 'Pattern Recognition'}
            </div>
            <Badge variant="outline" className={insightLevel === 'trends' ? 'text-[#f3c012] border-[#f3c012]' : 'text-blue-600 border-blue-600'}>
              {daysActive} days of data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            {insightLevel === 'trends' 
              ? 'Advanced AI analysis of your long-term wellbeing patterns with predictive insights and sophisticated recommendations.'
              : 'Weekly pattern recognition based on your recent check-ins, helping you understand your wellbeing trends.'
            }
          </p>
        </CardContent>
      </Card>

      {/* Enhanced Insights Display */}
      {daysActive >= 7 && (
        <AdvancedInsightsCard
          insights={enhancedInsights.patterns}
          title="Pattern Insights"
          icon="trending"
          gradientFrom="from-blue-50"
          gradientTo="to-cyan-50"
        />
      )}

      {daysActive >= 15 && (
        <AdvancedInsightsCard
          insights={enhancedInsights.trends}
          title="Trend Analysis"
          icon="brain"
          gradientFrom="from-purple-50"
          gradientTo="to-pink-50"
        />
      )}

      {/* Personalized Recommendations */}
      {enhancedInsights.recommendations.length > 0 && (
        <AdvancedInsightsCard
          insights={enhancedInsights.recommendations}
          title="Growth Recommendations"
          icon="lightbulb"
          gradientFrom="from-amber-50"
          gradientTo="to-orange-50"
        />
      )}

      {/* Immediate Insights for all users */}
      {enhancedInsights.immediate.length > 0 && (
        <AdvancedInsightsCard
          insights={enhancedInsights.immediate}
          title="Recent Insights"
          icon="target"
          gradientFrom="from-green-50"
          gradientTo="to-emerald-50"
        />
      )}

      {/* No Data State */}
      {enhancedInsights.patterns.length === 0 && enhancedInsights.trends.length === 0 && enhancedInsights.immediate.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-700 mb-2">
              {insightLevel === 'trends' ? 'Building Advanced Insights...' : 'Analyzing Your Patterns...'}
            </h3>
            <p className="text-sm text-gray-600">
              {insightLevel === 'trends' 
                ? 'Your AI insights are being generated based on your comprehensive data. Check back tomorrow!'
                : 'Continue with daily check-ins to build more detailed pattern insights.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizationInsights;
