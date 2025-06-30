import { supabase } from "@/integrations/supabase/client";
import { DynamicQuestionContext } from "./dynamicTypes";

export class ContextAnalyzer {
  async buildUserContext(userId: string): Promise<DynamicQuestionContext> {
    console.log('Building user context for:', userId);
    
    const [
      recentCheckins,
      recentJournals,
      recentResponses,
      userProfile
    ] = await Promise.all([
      this.getRecentCheckins(userId),
      this.getRecentJournals(userId),
      this.getRecentResponses(userId),
      this.getUserProfile(userId)
    ]);

    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now);
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      userId,
      recentMoodScores: recentCheckins.map(c => c.mood_score).filter(Boolean),
      recentStressLevels: recentCheckins.map(c => c.stress_level).filter(Boolean),
      journalKeywords: this.extractKeywords(recentJournals),
      focusAreas: userProfile?.focus_areas || [],
      timeOfDay,
      dayOfWeek,
      recentResponses
    };
  }

  private async getRecentCheckins(userId: string) {
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('mood_score, stress_level, energy_level, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent checkins:', error);
      return [];
    }

    return data || [];
  }

  private async getRecentJournals(userId: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('content, title, tags, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recent journals:', error);
      return [];
    }

    return data || [];
  }

  private async getRecentResponses(userId: string) {
    const { data, error } = await supabase
      .from('question_responses')
      .select(`
        *,
        assessment_questions(id, category, target_focus_areas)
      `)
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent responses:', error);
      return [];
    }

    return data || [];
  }

  private async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('focus_areas')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  private extractKeywords(journals: any[]): string[] {
    const keywords: string[] = [];
    
    journals.forEach(journal => {
      // Extract from tags
      if (journal.tags) {
        keywords.push(...journal.tags);
      }
      
      // Extract meaningful words from content
      const words = this.extractMeaningfulWords(journal.content || '');
      keywords.push(...words);
      
      // Extract from title
      if (journal.title) {
        const titleWords = this.extractMeaningfulWords(journal.title);
        keywords.push(...titleWords);
      }
    });
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  private extractMeaningfulWords(text: string): string[] {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
      'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those'
    ]);
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 20); // Limit to most frequent meaningful words
  }

  private getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' {
    const hour = date.getHours();
    
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
}

export const contextAnalyzer = new ContextAnalyzer();
