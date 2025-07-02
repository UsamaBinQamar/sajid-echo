
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import AssessmentHistory from "@/components/insights/AssessmentHistory";
import PersonalizationInsights from "@/components/insights/PersonalizationInsights";
import UnifiedInsightsCard from "@/components/insights/UnifiedInsightsCard";
import ExportButton from "@/components/insights/ExportButton";
import { TrendingUp, History, ArrowLeft, Zap, BarChart3, Lock } from "lucide-react";

interface InsightAccess {
  liveInsights: boolean;
  patterns: boolean;
  trends: boolean;
  daysActive: number;
}

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [insightAccess, setInsightAccess] = useState<InsightAccess>({
    liveInsights: false,
    patterns: false,
    trends: false,
    daysActive: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }
        await checkInsightAccess(session.user.id);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const checkInsightAccess = async (userId: string) => {
    try {
      const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [checkinsData, responsesData] = await Promise.all([
        supabase
          .from('daily_checkins')
          .select('date')
          .eq('user_id', userId)
          .gte('date', fifteenDaysAgo),
        supabase
          .from('question_responses')
          .select('created_at')
          .eq('user_id', userId)
          .gte('created_at', `${fifteenDaysAgo}T00:00:00Z`)
      ]);

      const checkins = checkinsData.data || [];
      const responses = responsesData.data || [];

      const uniqueDays = new Set([
        ...checkins.map(c => c.date),
        ...responses.map(r => r.created_at.split('T')[0])
      ]).size;

      setInsightAccess({
        liveInsights: uniqueDays >= 1,
        patterns: uniqueDays >= 7,
        trends: uniqueDays >= 15,
        daysActive: uniqueDays
      });
    } catch (error) {
      console.error('Error checking insight access:', error);
    }
  };

  const getDefaultTab = () => {
    if (insightAccess.liveInsights) return "live";
    return "live";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:bg-black dark:bg-none flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3c012] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:bg-gray-900 dark:bg-none dark:text-white transition-colors duration-300">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">Your Growth Insights</h1>
              <p className="text-gray-600 dark:text-white">Track your progress and get personalized recommendations</p>
            </div>
            <ExportButton />
          </div>
        </div>

        {/* Unified Insights Overview */}
        <div className="mb-8">
          <UnifiedInsightsCard showHistory={true} />
        </div>

        <Tabs defaultValue={getDefaultTab()} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger 
              value="live" 
              className="flex items-center space-x-2"
              disabled={!insightAccess.liveInsights}
            >
              {insightAccess.liveInsights ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>Live Insights</span>
            </TabsTrigger>
            <TabsTrigger 
              value="patterns" 
              className="flex items-center space-x-2"
              disabled={!insightAccess.patterns}
            >
              {insightAccess.patterns ? (
                <BarChart3 className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>Patterns</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="flex items-center space-x-2"
              disabled={!insightAccess.trends}
            >
              {insightAccess.trends ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            {insightAccess.liveInsights ? (
              <UnifiedInsightsCard mode="live-only" showHeader={false} />
            ) : (
              <div className="text-center py-12">
                <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-white" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">Live Insights Locked</h3>
                <p className="text-gray-600 dark:text-white mb-6">
                  Complete your first wellness check-in to unlock real-time insights about your wellbeing.
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                  Complete Assessment
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="patterns">
            {insightAccess.patterns ? (
              <PersonalizationInsights />
            ) : (
              <div className="text-center py-12">
                <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Pattern Recognition Locked</h3>
                <p className="text-gray-600 mb-4">
                  Complete check-ins for {7 - insightAccess.daysActive} more days to unlock pattern recognition.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Pattern insights help you understand your wellbeing trends over time and provide personalized recommendations.
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                  Continue Building Data
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends">
            {insightAccess.trends ? (
              <PersonalizationInsights />
            ) : (
              <div className="text-center py-12">
                <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Trend Analysis Locked</h3>
                <p className="text-gray-600 mb-4">
                  Complete check-ins for {15 - insightAccess.daysActive} more days to unlock advanced trend analysis.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Trend analysis provides AI-powered predictions, long-term insights, and sophisticated growth recommendations.
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                  Keep Building Your Journey
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <AssessmentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insights;
