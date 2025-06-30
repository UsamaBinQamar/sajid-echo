
import { supabase } from "@/integrations/supabase/client";
import { ContextualTrigger } from "./types";

class ContextualAwareness {
  async getRecommendations(userId: string): Promise<ContextualTrigger[]> {
    const context = await this.getCurrentContext(userId);
    const triggers: ContextualTrigger[] = [];

    // Time-based recommendations
    triggers.push(...this.getTimeBasedTriggers(context));
    
    // Pattern-based recommendations
    triggers.push(...await this.getPatternBasedTriggers(userId, context));

    return triggers.filter(trigger => trigger.active)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5); // Top 5 recommendations
  }

  async optimizeNotificationTiming(userId: string): Promise<string[]> {
    // Analyze user's engagement patterns to find optimal notification times
    const { data: responses } = await supabase
      .from('question_responses')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!responses || responses.length === 0) {
      return ['09:00', '15:00', '19:00']; // Default times
    }

    const hours = responses.map(r => new Date(r.created_at).getHours());
    const hourCounts = hours.reduce((acc, hour) => {
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Find top 3 most active hours
    const topHours = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour.padStart(2, '0')}:00`);

    return topHours;
  }

  private async getCurrentContext(userId: string) {
    const now = new Date();
    
    return {
      timeOfDay: this.getTimeOfDay(now),
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
      hour: now.getHours(),
      isWeekend: now.getDay() === 0 || now.getDay() === 6,
      userId
    };
  }

  private getTimeBasedTriggers(context: any): ContextualTrigger[] {
    const triggers: ContextualTrigger[] = [];

    // Morning routine
    if (context.hour >= 6 && context.hour <= 10) {
      triggers.push({
        triggerId: 'morning_routine',
        triggerType: 'time_based',
        condition: 'Morning hours (6-10 AM)',
        recommendation: 'Start your day with a mindful moment or intention setting',
        priority: 8,
        active: true
      });
    }

    // Lunch break wellness
    if (context.hour >= 11 && context.hour <= 14 && !context.isWeekend) {
      triggers.push({
        triggerId: 'midday_break',
        triggerType: 'time_based',
        condition: 'Lunch time on weekday',
        recommendation: 'Take a mindful break - step outside or do a quick breathing exercise',
        priority: 6,
        active: true
      });
    }

    // Evening reflection
    if (context.hour >= 18 && context.hour <= 21) {
      triggers.push({
        triggerId: 'evening_reflection',
        triggerType: 'time_based',
        condition: 'Evening hours (6-9 PM)',
        recommendation: 'Perfect time for journaling or reflecting on your day',
        priority: 7,
        active: true
      });
    }

    // Weekend self-care
    if (context.isWeekend && context.hour >= 9 && context.hour <= 12) {
      triggers.push({
        triggerId: 'weekend_selfcare',
        triggerType: 'time_based',
        condition: 'Weekend morning',
        recommendation: 'Weekend self-care time - engage in an activity that brings you joy',
        priority: 9,
        active: true
      });
    }

    return triggers;
  }

  private async getPatternBasedTriggers(userId: string, context: any): Promise<ContextualTrigger[]> {
    const triggers: ContextualTrigger[] = [];

    // Check recent mood patterns
    const { data: recentCheckins } = await supabase
      .from('daily_checkins')
      .select('mood_score, stress_level, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (recentCheckins && recentCheckins.length > 0) {
      const avgMood = recentCheckins.reduce((sum, checkin) => sum + (checkin.mood_score || 3), 0) / recentCheckins.length;
      const avgStress = recentCheckins.reduce((sum, checkin) => sum + (checkin.stress_level || 3), 0) / recentCheckins.length;

      // Low mood pattern
      if (avgMood < 3) {
        triggers.push({
          triggerId: 'mood_support',
          triggerType: 'calendar_based',
          condition: 'Recent low mood pattern detected',
          recommendation: 'Consider reaching out to a friend or practicing a mood-boosting activity',
          priority: 10,
          active: true
        });
      }

      // High stress pattern
      if (avgStress > 3.5) {
        triggers.push({
          triggerId: 'stress_management',
          triggerType: 'calendar_based',
          condition: 'Elevated stress levels detected',
          recommendation: 'Time for stress relief - try deep breathing, meditation, or gentle movement',
          priority: 9,
          active: true
        });
      }
    }

    // Check for consistency patterns
    const { data: journalStreak } = await supabase
      .from('journal_entries')
      .select('id, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (journalStreak && journalStreak.length === 0) {
      triggers.push({
        triggerId: 'journal_encouragement',
        triggerType: 'calendar_based',
        condition: 'No recent journaling activity',
        recommendation: 'A few minutes of journaling can help process your thoughts and feelings',
        priority: 5,
        active: true
      });
    }

    return triggers;
  }

  private getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
}

export const contextualAwareness = new ContextualAwareness();
