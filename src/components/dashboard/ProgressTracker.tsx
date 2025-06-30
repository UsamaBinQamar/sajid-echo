import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Calendar, TrendingUp, Star, Award, Crown, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
interface StatsType {
  journalEntries: number;
  dailyAssessments: number;
  dialogueSessions: number;
  weeklyGoal: number;
  currentStreak: number;
}
const ProgressTracker = () => {
  const [stats, setStats] = useState<StatsType>({
    journalEntries: 0,
    dailyAssessments: 0,
    dialogueSessions: 0,
    weeklyGoal: 7,
    currentStreak: 0
  });
  const [achievements, setAchievements] = useState<string[]>([]);
  useEffect(() => {
    loadProgressData();
  }, []);
  const loadProgressData = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Get journal entries from last week
      const {
        data: journalData
      } = await supabase.from("journal_entries").select("id").eq("user_id", user.id).gte("created_at", oneWeekAgo.toISOString());

      // Get daily assessments (mood check-ins) from last week
      const {
        data: assessmentData
      } = await supabase.from("daily_checkins").select("id").eq("user_id", user.id).gte("created_at", oneWeekAgo.toISOString());

      // Get dialogue sessions from last week
      const {
        data: dialogueData
      } = await supabase.from("dialogue_sessions").select("id").eq("user_id", user.id).gte("started_at", oneWeekAgo.toISOString());

      // Calculate current streak
      const {
        data: streakData
      } = await supabase.from("daily_checkins").select("date").eq("user_id", user.id).order("date", {
        ascending: false
      }).limit(7);
      let currentStreak = 0;
      if (streakData && streakData.length > 0) {
        const dates = streakData.map(d => d.date);
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date();
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];
          if (dates.includes(dateStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      const newStats = {
        journalEntries: journalData?.length || 0,
        dailyAssessments: assessmentData?.length || 0,
        dialogueSessions: dialogueData?.length || 0,
        weeklyGoal: 7,
        currentStreak
      };
      setStats(newStats);
      updateAchievements(newStats);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };
  const updateAchievements = (statsData: StatsType) => {
    const newAchievements: string[] = [];
    if (statsData.currentStreak >= 3) newAchievements.push('3-day streak');
    if (statsData.currentStreak >= 7) newAchievements.push('Week warrior');
    if (statsData.currentStreak >= 14) newAchievements.push('Consistency champion');
    if (statsData.dailyAssessments >= 5) newAchievements.push('Self-aware leader');
    if (statsData.journalEntries >= 3) newAchievements.push('Reflective thinker');
    if (statsData.dialogueSessions >= 2) newAchievements.push('Practice makes progress');
    if (statsData.dailyAssessments >= statsData.weeklyGoal) newAchievements.push('Goal crusher');
    setAchievements(newAchievements);
  };
  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case '3-day streak':
      case 'Week warrior':
      case 'Consistency champion':
        return <Flame className="h-4 w-4" />;
      case 'Goal crusher':
        return <Crown className="h-4 w-4" />;
      case 'Self-aware leader':
        return <Star className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };
  const getMotivationalMessage = () => {
    if (stats.currentStreak >= 7) return "You're on fire! Keep this amazing momentum going! 🔥";
    if (stats.currentStreak >= 3) return "Great consistency! You're building powerful habits! ⭐";
    if (stats.dailyAssessments >= 5) return "Your self-awareness is growing beautifully! 🌱";
    if (stats.journalEntries >= 3) return "Your reflections are shaping you into a stronger leader! 💪";
    return "Every step forward matters on your leadership journey! 🚀";
  };
  const weeklyProgress = stats.dailyAssessments / stats.weeklyGoal * 100;
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-purple-100">
          <p className="text-sm font-medium text-black ">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Weekly Goal Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Daily Check-ins</span>
            <span className="text-sm text-gray-600">{stats.dailyAssessments}/{stats.weeklyGoal}</span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Current Streak</span>
          </div>
          <Badge variant={stats.currentStreak > 0 ? "default" : "secondary"} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            {stats.currentStreak} days
          </Badge>
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{stats.journalEntries}</div>
            <div className="text-xs text-gray-600">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{stats.dialogueSessions}</div>
            <div className="text-xs text-gray-600">Practice Sessions</div>
          </div>
        </div>

        {/* Achievement Badges */}
        {achievements.length > 0 && <div className="pt-3 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {achievements.slice(0, 3).map(achievement => <Badge key={achievement} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse">
                  {getAchievementIcon(achievement)}
                  <span className="ml-1 text-xs">{achievement}</span>
                </Badge>)}
              {achievements.length > 3 && <Badge variant="outline" className="bg-gray-50 text-gray-600">
                  +{achievements.length - 3} more
                </Badge>}
            </div>
          </div>}

        {/* Special Achievement for Weekly Goal */}
        {stats.currentStreak >= 7 && <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 animate-bounce">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Leadership Consistency Master!</span>
          </div>}
      </CardContent>
    </Card>;
};
export default ProgressTracker;