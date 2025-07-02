
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Heart, MessageCircle, TrendingUp, ExternalLink, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  type: 'journal' | 'mood' | 'dialogue' | 'assessment';
  title: string;
  timestamp: string;
  score?: number;
  url?: string;
  isComplete?: boolean;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const activities: Activity[] = [];

      // Get recent journal entries
      const { data: journalData } = await supabase
        .from("journal_entries")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (journalData) {
        journalData.forEach(entry => {
          activities.push({
            id: entry.id,
            type: 'journal',
            title: entry.title || 'Untitled Entry',
            timestamp: entry.created_at,
            url: `/journal?edit=${entry.id}`,
            isComplete: true
          });
        });
      }

      // Get recent mood check-ins
      const { data: moodData } = await supabase
        .from("daily_checkins")
        .select("id, mood_score, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (moodData) {
        moodData.forEach(mood => {
          activities.push({
            id: mood.id,
            type: 'mood',
            title: 'Daily Mood Check-in',
            timestamp: mood.created_at,
            score: mood.mood_score,
            url: '/insights',
            isComplete: true
          });
        });
      }

      // Get recent dialogue sessions
      const { data: dialogueData } = await supabase
        .from("dialogue_sessions")
        .select(`
          id, 
          started_at,
          completed_at,
          dialogue_scenarios(title)
        `)
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(3);

      if (dialogueData) {
        dialogueData.forEach(session => {
          activities.push({
            id: session.id,
            type: 'dialogue',
            title: `Practice: ${session.dialogue_scenarios?.title || 'Leadership Scenario'}`,
            timestamp: session.started_at,
            url: session.completed_at ? `/dialogue-simulator?session=${session.id}` : `/dialogue-simulator?continue=${session.id}`,
            isComplete: !!session.completed_at
          });
        });
      }

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'journal': return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'mood': return <Heart className="h-4 w-4 text-pink-600" />;
      case 'dialogue': return <MessageCircle className="h-4 w-4 text-[#f3c012]" />;
      case 'assessment': return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const handleActivityClick = (activity: Activity) => {
    if (activity.url) {
      navigate(activity.url);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No recent activity. Start your leadership journey today!
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group border border-transparent hover:border-gray-200"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    {activity.score && (
                      <Badge variant="outline" className="text-xs">
                        Score: {activity.score}/5
                      </Badge>
                    )}
                    {!activity.isComplete && (
                      <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                        <Play className="h-3 w-3 mr-1" />
                        Continue
                      </Badge>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
