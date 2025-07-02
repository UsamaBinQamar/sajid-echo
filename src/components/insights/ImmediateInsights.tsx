import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Brain, TrendingUp, Zap, AlertCircle, CheckCircle, ArrowRight, Activity } from "lucide-react";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

interface LiveInsight {
  id: string;
  type: 'immediate' | 'trend' | 'achievement' | 'suggestion';
  title: string;
  message: string;
  confidence: number;
  timestamp: string;
  actionable?: boolean;
  category?: string;
}

interface QuestionResponse {
  id: string;
  response_score: number;
  created_at: string;
  assessment_questions?: {
    category: string;
    question_text: string;
  };
}

interface DailyCheckin {
  id: string;
  mood_score?: number;
  stress_level?: number;
  energy_level?: number;
  date: string;
}

const ImmediateInsights = () => {
  const [insights, setInsights] = useState<LiveInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadLiveInsights();
    
    // Set up real-time listener for new assessment responses
    const channel = supabase
      .channel('assessment-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'question_responses'
      }, () => {
        console.log('New assessment response detected, refreshing insights...');
        loadLiveInsights();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'daily_checkins'
      }, () => {
        console.log('New daily checkin detected, refreshing insights...');
        loadLiveInsights();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadLiveInsights = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get today's assessment responses
      const { data: todayResponses } = await supabase
        .from('question_responses')
        .select('*, assessment_questions(category, question_text)')
        .eq('user_id', userId)
        .gte('created_at', todayStart.toISOString());

      // Get today's check-ins
      const { data: todayCheckins } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', userId)
        .eq('date', now.toISOString().split('T')[0]);

      // Get recent patterns for trend analysis
      const { data: recentResponses } = await supabase
        .from('question_responses')
        .select('*, assessment_questions(category, question_text)')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const generatedInsights = await generateRealTimeInsights(
        todayResponses as QuestionResponse[] || [],
        todayCheckins as DailyCheckin[] || [],
        recentResponses as QuestionResponse[] || []
      );

      setInsights(generatedInsights);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading live insights:', error);
      toast({
        title: "Error loading insights",
        description: "We couldn't load your latest insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRealTimeInsights = async (
    todayResponses: QuestionResponse[],
    todayCheckins: DailyCheckin[],
    recentResponses: QuestionResponse[]
  ): Promise<LiveInsight[]> => {
    const insights: LiveInsight[] = [];

    // Immediate insights from today's activity
    if (todayResponses.length > 0) {
      const avgScore = todayResponses.reduce((sum, r) => sum + r.response_score, 0) / todayResponses.length;
      const timestamp = new Date().toISOString();

      if (avgScore >= 4) {
        insights.push({
          id: `strong-${Date.now()}`,
          type: 'achievement',
          title: 'Strong Performance Today! 🌟',
          message: `You're performing excellently today with an average score of ${avgScore.toFixed(1)}/5 across ${todayResponses.length} responses. Keep up the momentum!`,
          confidence: 0.9,
          timestamp,
          actionable: true
        });
      } else if (avgScore < 3) {
        insights.push({
          id: `support-${Date.now()}`,
          type: 'suggestion',
          title: 'Focus Area Identified',
          message: `Today's responses suggest some challenges (avg: ${avgScore.toFixed(1)}/5). Consider taking a few minutes for reflection or seeking additional support.`,
          confidence: 0.8,
          timestamp,
          actionable: true
        });
      } else {
        insights.push({
          id: `steady-${Date.now()}`,
          type: 'immediate',
          title: 'Steady Progress',
          message: `You've completed ${todayResponses.length} assessments today with balanced scores. Your awareness and reflection are building positive habits.`,
          confidence: 0.7,
          timestamp,
          actionable: false
        });
      }

      // Category-specific insights
      const categoryGroups = todayResponses.reduce((groups, response) => {
        const category = response.assessment_questions?.category || 'general';
        if (!groups[category]) groups[category] = [];
        groups[category].push(response);
        return groups;
      }, {} as { [key: string]: QuestionResponse[] });

      Object.entries(categoryGroups).forEach(([category, responses]) => {
        if (responses.length >= 2) {
          const categoryAvg = responses.reduce((sum, r) => sum + r.response_score, 0) / responses.length;
          
          if (categoryAvg >= 4) {
            insights.push({
              id: `category-strong-${category}-${Date.now()}`,
              type: 'achievement',
              title: `${category.replace('_', ' ')} Strength`,
              message: `Excellent ${category.replace('_', ' ')} awareness today (${categoryAvg.toFixed(1)}/5). This is clearly a strength area for you.`,
              confidence: 0.85,
              timestamp: new Date().toISOString(),
              category,
              actionable: false
            });
          } else if (categoryAvg < 2.5) {
            insights.push({
              id: `category-focus-${category}-${Date.now()}`,
              type: 'suggestion',
              title: `${category.replace('_', ' ')} Growth Opportunity`,
              message: `Consider focusing more attention on ${category.replace('_', ' ')} (${categoryAvg.toFixed(1)}/5 today). Small improvements here could have big impact.`,
              confidence: 0.8,
              timestamp: new Date().toISOString(),
              category,
              actionable: true
            });
          }
        }
      });
    }

    // Check-in insights
    if (todayCheckins.length > 0) {
      const checkin = todayCheckins[0];
      const timestamp = new Date().toISOString();

      if (checkin.mood_score && checkin.stress_level) {
        const moodStressBalance = checkin.mood_score - checkin.stress_level;
        
        if (moodStressBalance >= 2) {
          insights.push({
            id: `balance-good-${Date.now()}`,
            type: 'achievement',
            title: 'Great Mood-Stress Balance',
            message: `Your mood (${checkin.mood_score}/5) is significantly higher than stress (${checkin.stress_level}/5). You're managing stress well today!`,
            confidence: 0.9,
            timestamp,
            actionable: false
          });
        } else if (moodStressBalance <= -2) {
          insights.push({
            id: `balance-concern-${Date.now()}`,
            type: 'suggestion',
            title: 'Stress Management Opportunity',
            message: `Stress levels (${checkin.stress_level}/5) are notably higher than mood (${checkin.mood_score}/5). Consider stress-reduction techniques.`,
            confidence: 0.85,
            timestamp,
            actionable: true
          });
        }
      }

      if (checkin.energy_level && checkin.energy_level <= 2) {
        insights.push({
          id: `energy-low-${Date.now()}`,
          type: 'suggestion',
          title: 'Energy Support Needed',
          message: `Low energy levels today (${checkin.energy_level}/5). Consider what might help restore your energy - rest, nutrition, or gentle movement.`,
          confidence: 0.8,
          timestamp,
          actionable: true
        });
      }
    }

    // Trend insights from recent data
    if (recentResponses.length >= 5) {
      const recentAvg = recentResponses.slice(0, 5).reduce((sum, r) => sum + r.response_score, 0) / 5;
      const olderAvg = recentResponses.slice(5, 10).reduce((sum, r) => sum + r.response_score, 0) / Math.min(5, recentResponses.length - 5);
      
      if (olderAvg > 0 && recentAvg - olderAvg >= 0.5) {
        insights.push({
          id: `trend-improving-${Date.now()}`,
          type: 'trend',
          title: 'Upward Trend Detected! 📈',
          message: `Your recent responses show clear improvement (${recentAvg.toFixed(1)} vs ${olderAvg.toFixed(1)} previously). Your efforts are paying off!`,
          confidence: 0.85,
          timestamp: new Date().toISOString(),
          actionable: false
        });
      } else if (olderAvg > 0 && olderAvg - recentAvg >= 0.5) {
        insights.push({
          id: `trend-declining-${Date.now()}`,
          type: 'suggestion',
          title: 'Trend Needs Attention',
          message: `Recent responses suggest a downward pattern. This might be a good time to reflect on what's changed and seek additional support.`,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
          actionable: true
        });
      }
    }

    // Engagement insights
    if (todayResponses.length === 0 && todayCheckins.length === 0) {
      insights.push({
        id: `engagement-${Date.now()}`,
        type: 'suggestion',
        title: 'Ready for Today\'s Check-in?',
        message: 'Starting your day with a quick assessment can provide valuable insights and set a positive tone for reflection.',
        confidence: 0.7,
        timestamp: new Date().toISOString(),
        actionable: true
      });
    } else if (todayResponses.length >= 3) {
      insights.push({
        id: `engagement-high-${Date.now()}`,
        type: 'achievement',
        title: 'High Engagement Today! 🎯',
        message: `You've completed ${todayResponses.length} assessments today. This level of self-awareness is building strong mindfulness habits.`,
        confidence: 0.9,
        timestamp: new Date().toISOString(),
        actionable: false
      });
    }

    return insights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suggestion': return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'trend': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <Zap className="h-4 w-4 text-[#f3c012]" />;
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-[#f3c012]" />
            Live Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f3c012]"></div>
              <span className="ml-2 text-sm text-muted-foreground">Analyzing your latest data...</span>
            </div>
            <LoadingSkeleton variant="list" lines={3} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#f3c012]" />
              Live Insights
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                Last updated: {lastUpdate}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadLiveInsights}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time insights based on your latest assessments and check-ins
          </p>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Generate Insights</h3>
              <p className="text-gray-600 mb-6">
                Complete an assessment or daily check-in to see personalized insights appear here in real-time.
              </p>
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-[#f3c012] to-blue-600">
                Start Assessment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                      
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(insight.confidence * 100)}% confident
                          </Badge>
                          {insight.category && (
                            <Badge variant="outline" className="text-xs">
                              {insight.category.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                        {insight.actionable && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate("/dashboard")}
                          >
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="w-full"
                >
                  Complete the Smart Assessment for More Insights
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImmediateInsights;
