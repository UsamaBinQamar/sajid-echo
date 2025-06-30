
import { supabase } from "@/integrations/supabase/client";
import { PersonalizationInsight } from "./types";

export class JournalAnalyzer {
  async analyzeJournalPatterns(userId: string, days: number = 14): Promise<PersonalizationInsight[]> {
    const { data: entries, error } = await supabase
      .from("journal_entries")
      .select("content, mood_score, created_at, tags")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    if (error || !entries) {
      console.error("Error fetching journal entries:", error);
      return [];
    }

    const insights: PersonalizationInsight[] = [];

    // Analyze mood trends
    const moodScores = entries.filter(e => e.mood_score).map(e => e.mood_score);
    if (moodScores.length > 0) {
      const avgMood = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
      
      if (avgMood < 3) {
        insights.push({
          type: 'recommendation',
          category: 'emotional_wellbeing',
          message: 'Your recent mood scores suggest you might benefit from focusing on emotional well-being',
          confidence: 0.8,
          suggested_questions: ['emotional_regulation', 'stress_management'],
          action_items: ['Consider scheduling time for self-care activities', 'Explore stress reduction techniques']
        });
      }
    }

    // Analyze content for stress indicators
    const stressKeywords = ['stressed', 'overwhelmed', 'anxious', 'pressure', 'deadline', 'busy', 'tired'];
    const stressEntries = entries.filter(entry => 
      stressKeywords.some(keyword => 
        entry.content.toLowerCase().includes(keyword)
      )
    );

    if (stressEntries.length > entries.length * 0.4) {
      insights.push({
        type: 'contextual_trigger',
        category: 'stress_management',
        message: 'Your journal entries frequently mention stress-related topics',
        confidence: 0.9,
        suggested_questions: ['work_boundaries', 'stress_coping'],
        action_items: ['Focus on work-life balance questions', 'Consider stress management techniques']
      });
    }

    // Analyze sleep mentions
    const sleepKeywords = ['tired', 'exhausted', 'sleep', 'insomnia', 'rest'];
    const sleepEntries = entries.filter(entry =>
      sleepKeywords.some(keyword =>
        entry.content.toLowerCase().includes(keyword)
      )
    );

    if (sleepEntries.length > 2) {
      insights.push({
        type: 'recommendation',
        category: 'sleep_recovery',
        message: 'You\'ve mentioned sleep-related concerns in recent entries',
        confidence: 0.7,
        suggested_questions: ['sleep_quality', 'recovery_time'],
        action_items: ['Prioritize sleep hygiene questions', 'Track sleep patterns']
      });
    }

    return insights;
  }
}

export const journalAnalyzer = new JournalAnalyzer();
