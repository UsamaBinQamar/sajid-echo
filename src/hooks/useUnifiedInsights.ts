
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { dailyReflectionService, type DailyReflection } from "@/services/insights/dailyReflectionService";

interface InsightLevel {
  name: string;
  daysRequired: number;
  description: string;
  features: string[];
  unlocked: boolean;
}

interface LiveInsight {
  id: string;
  type: 'immediate' | 'trend' | 'achievement' | 'suggestion';
  title: string;
  message: string;
  confidence: number;
  timestamp: string;
  actionable?: boolean;
  category?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AssessmentHistoryItem {
  id: string;
  date: string;
  type: 'checkin' | 'assessment';
  responses: number;
  averageScore: number;
  categories: string[];
}

interface UnifiedInsightsData {
  daysActive: number;
  totalResponses: number;
  currentStreak: number;
  hasDataToday: boolean;
  nextMilestone: string;
  progress: number;
  liveInsights: LiveInsight[];
  unlockedLevels: InsightLevel[];
  currentLevel: InsightLevel | null;
  nextLevel: InsightLevel | null;
  assessmentHistory: AssessmentHistoryItem[];
  recentReflections: DailyReflection[];
}

export const useUnifiedInsights = () => {
  const [data, setData] = useState<UnifiedInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { toast } = useToast();

  const insightLevels: InsightLevel[] = [
    {
      name: "Live Insights",
      daysRequired: 1,
      description: "Real-time feedback and today's snapshot",
      features: ["Current mood, stress, energy", "Streak tracking", "Immediate encouragement"],
      unlocked: false
    },
    {
      name: "Pattern Recognition",
      daysRequired: 7,
      description: "Weekly trends and behavior patterns",
      features: ["Mood patterns", "Stress trends", "Personalized suggestions"],
      unlocked: false
    },
    {
      name: "Trend Analysis",
      daysRequired: 15,
      description: "Advanced AI-powered insights and predictions",
      features: ["Long-term trends", "Predictive analytics", "Growth recommendations"],
      unlocked: false
    }
  ];

  const loadUnifiedData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [checkinsData, responsesData, todayResponsesData, todayCheckinsData] = await Promise.all([
        supabase.from('daily_checkins').select('*').eq('user_id', userId).gte('date', thirtyDaysAgo).order('date', { ascending: false }),
        supabase.from('question_responses').select('*, assessment_questions(category, question_text)').eq('user_id', userId).gte('created_at', `${thirtyDaysAgo}T00:00:00Z`).order('created_at', { ascending: false }),
        supabase.from('question_responses').select('*, assessment_questions(category, question_text)').eq('user_id', userId).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from('daily_checkins').select('*').eq('user_id', userId).eq('date', today)
      ]);

      const checkins = checkinsData.data || [];
      const responses = responsesData.data || [];
      const todayResponses = todayResponsesData.data || [];
      const todayCheckins = todayCheckinsData.data || [];

      // Calculate basic metrics
      const totalResponses = responses.length + checkins.length;
      const uniqueDays = new Set([...checkins.map(c => c.date), ...responses.map(r => r.created_at.split('T')[0])]).size;

      // Calculate streak
      let currentStreak = 0;
      const sortedDates = Array.from(new Set([...checkins.map(c => c.date), ...responses.map(r => r.created_at.split('T')[0])])).sort().reverse();
      let currentDate = new Date();
      for (const dateStr of sortedDates) {
        const checkDate = new Date(dateStr);
        const diffDays = Math.floor((currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= currentStreak + 1) {
          currentStreak++;
          currentDate = checkDate;
        } else {
          break;
        }
      }

      const hasDataToday = todayCheckins.length > 0 || todayResponses.length > 0;

      // Calculate progress and milestones
      let progress = 0;
      let nextMilestone = "";
      if (uniqueDays >= 15) {
        progress = 100;
        nextMilestone = "All insights unlocked!";
      } else if (uniqueDays >= 7) {
        progress = 70 + (uniqueDays - 7) / 8 * 30;
        nextMilestone = `${15 - uniqueDays} more days for trend analysis`;
      } else if (uniqueDays >= 1) {
        progress = 10 + (uniqueDays - 1) / 6 * 60;
        nextMilestone = `${7 - uniqueDays} more days for pattern recognition`;
      } else {
        progress = 5;
        nextMilestone = "Complete your first assessment";
      }

      // Generate assessment history
      const assessmentHistory = await generateAssessmentHistory(checkins, responses);
      
      // Generate daily reflections for recent activity
      const recentReflections = await generateDailyReflections(assessmentHistory.slice(0, 5), responses, checkins);

      // Generate live insights
      const liveInsights = await generatePrioritizedInsights(todayResponses, todayCheckins, responses.slice(0, 10));

      // Process insight levels
      const unlockedLevels = insightLevels.map(level => ({
        ...level,
        unlocked: uniqueDays >= level.daysRequired
      }));

      const currentLevel = unlockedLevels.filter(l => l.unlocked).pop() || null;
      const nextLevel = unlockedLevels.find(l => !l.unlocked) || null;

      setData({
        daysActive: uniqueDays,
        totalResponses,
        currentStreak,
        hasDataToday,
        nextMilestone,
        progress,
        liveInsights,
        unlockedLevels,
        currentLevel,
        nextLevel,
        assessmentHistory,
        recentReflections
      });

      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading unified insights:', error);
      toast({
        title: "Error loading insights",
        description: "We couldn't load your latest insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAssessmentHistory = async (checkins: any[], responses: any[]): Promise<AssessmentHistoryItem[]> => {
    const historyMap = new Map<string, AssessmentHistoryItem>();

    // Process checkins
    checkins.forEach(checkin => {
      const date = checkin.date;
      if (!historyMap.has(date)) {
        historyMap.set(date, {
          id: `history-${date}`,
          date,
          type: 'checkin',
          responses: 0,
          averageScore: 0,
          categories: []
        });
      }
      const item = historyMap.get(date)!;
      item.responses += 1;
      const scores = [checkin.mood_score, checkin.stress_level, checkin.energy_level].filter(s => s !== null);
      if (scores.length > 0) {
        item.averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }
    });

    // Process responses
    responses.forEach(response => {
      const date = response.created_at.split('T')[0];
      if (!historyMap.has(date)) {
        historyMap.set(date, {
          id: `history-${date}`,
          date,
          type: 'assessment',
          responses: 0,
          averageScore: 0,
          categories: []
        });
      }
      const item = historyMap.get(date)!;
      item.responses += 1;
      const category = (response as any).assessment_questions?.category;
      if (category && !item.categories.includes(category)) {
        item.categories.push(category);
      }
      // Recalculate average score
      const dayResponses = responses.filter(r => r.created_at.split('T')[0] === date);
      item.averageScore = dayResponses.reduce((sum, r) => sum + r.response_score, 0) / dayResponses.length;
    });

    return Array.from(historyMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const generateDailyReflections = async (
    historyItems: AssessmentHistoryItem[],
    allResponses: any[],
    allCheckins: any[]
  ): Promise<DailyReflection[]> => {
    const reflections: DailyReflection[] = [];
    
    // Calculate user patterns for context
    const recentScores = historyItems.slice(0, 7).map(item => item.averageScore);
    const overallAverage = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length || 3;
    
    // Fix the type issue by properly typing recentTrend
    const recentTrend: 'improving' | 'declining' | 'stable' = recentScores.length >= 3 ? 
      (recentScores[0] > recentScores[2] ? 'improving' : 
       recentScores[0] < recentScores[2] ? 'declining' : 'stable') : 'stable';

    // Get category performance
    const categoryScores = new Map<string, number[]>();
    allResponses.forEach(response => {
      const category = (response as any).assessment_questions?.category;
      if (category) {
        if (!categoryScores.has(category)) {
          categoryScores.set(category, []);
        }
        categoryScores.get(category)!.push(response.response_score);
      }
    });

    const categoryAverages = Array.from(categoryScores.entries()).map(([category, scores]) => ({
      category,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));

    const strongCategories = categoryAverages
      .filter(cat => cat.average >= overallAverage + 0.3)
      .map(cat => cat.category);
    const challengingCategories = categoryAverages
      .filter(cat => cat.average <= overallAverage - 0.3)
      .map(cat => cat.category);

    // Generate reflections for recent items
    for (const item of historyItems) {
      const date = new Date(item.date);
      const dayOfWeek = date.toLocaleDateString('en', { weekday: 'long' });
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      // Get specific scores for check-ins
      const dayCheckin = allCheckins.find(c => c.date === item.date);
      const specificScores = dayCheckin ? {
        mood: dayCheckin.mood_score,
        stress: dayCheckin.stress_level,
        energy: dayCheckin.energy_level
      } : undefined;

      const context = {
        dayData: {
          date: item.date,
          type: item.type,
          responses: item.responses,
          averageScore: item.averageScore,
          categories: item.categories,
          specificScores
        },
        userPatterns: {
          recentTrend,
          averageScore: overallAverage,
          strongCategories,
          challengingCategories
        },
        contextualFactors: {
          dayOfWeek,
          isWeekend
        }
      };

      const reflection = await dailyReflectionService.generateDailyReflection(context);
      reflections.push(reflection);
    }

    return reflections;
  };

  const generatePrioritizedInsights = async (todayResponses: any[], todayCheckins: any[], recentResponses: any[]): Promise<LiveInsight[]> => {
    const insights: LiveInsight[] = [];

    // High priority: Today's performance
    if (todayResponses.length > 0) {
      const avgScore = todayResponses.reduce((sum, r) => sum + r.response_score, 0) / todayResponses.length;
      
      if (avgScore >= 4) {
        insights.push({
          id: `strong-${Date.now()}`,
          type: 'achievement',
          title: 'Excellent Day! 🌟',
          message: `Strong performance today with ${avgScore.toFixed(1)}/5 average across ${todayResponses.length} responses.`,
          confidence: 0.9,
          timestamp: new Date().toISOString(),
          actionable: false,
          priority: 'high'
        });
      } else if (avgScore < 3) {
        insights.push({
          id: `support-${Date.now()}`,
          type: 'suggestion',
          title: 'Growth Opportunity',
          message: `Today's responses suggest areas for focus (${avgScore.toFixed(1)}/5). Consider reflection or support.`,
          confidence: 0.8,
          timestamp: new Date().toISOString(),
          actionable: true,
          priority: 'high'
        });
      }
    }

    // Medium priority: Check-in insights
    if (todayCheckins.length > 0) {
      const checkin = todayCheckins[0];
      if (checkin.mood_score && checkin.stress_level) {
        const moodStressBalance = checkin.mood_score - checkin.stress_level;
        
        if (moodStressBalance >= 2) {
          insights.push({
            id: `balance-good-${Date.now()}`,
            type: 'achievement',
            title: 'Great Balance',
            message: `Excellent mood-stress balance today (${checkin.mood_score}/${checkin.stress_level}).`,
            confidence: 0.85,
            timestamp: new Date().toISOString(),
            priority: 'medium'
          });
        } else if (moodStressBalance <= -2) {
          insights.push({
            id: `balance-concern-${Date.now()}`,
            type: 'suggestion',
            title: 'Stress Management',
            message: `Consider stress-reduction techniques. Stress (${checkin.stress_level}) > Mood (${checkin.mood_score}).`,
            confidence: 0.8,
            timestamp: new Date().toISOString(),
            actionable: true,
            priority: 'high'
          });
        }
      }
    }

    // Low priority: Engagement encouragement
    if (todayResponses.length === 0 && todayCheckins.length === 0) {
      insights.push({
        id: `engagement-${Date.now()}`,
        type: 'suggestion',
        title: 'Ready for Today\'s Check-in?',
        message: 'Start your day with a quick assessment for valuable insights.',
        confidence: 0.7,
        timestamp: new Date().toISOString(),
        actionable: true,
        priority: 'low'
      });
    }

    // Sort by priority and confidence
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    }).slice(0, 3); // Show top 3 insights
  };

  useEffect(() => {
    loadUnifiedData();
    
    // Create a unique channel name to avoid conflicts
    const channelId = `unified-insights-${Math.random().toString(36).substring(7)}`;
    
    // Set up real-time listener with error handling
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'question_responses'
      }, () => {
        console.log('Received question_responses update');
        loadUnifiedData();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'daily_checkins'
      }, () => {
        console.log('Received daily_checkins update');
        loadUnifiedData();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to unified insights updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to unified insights updates');
        }
      });

    return () => {
      console.log('Cleaning up unified insights channel');
      supabase.removeChannel(channel);
    };
  }, []);

  return { data, loading, lastUpdate, refresh: loadUnifiedData };
};
