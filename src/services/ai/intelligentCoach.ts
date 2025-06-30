
import { openAIService } from "./openAIService";
import { supabase } from "@/integrations/supabase/client";
import { CoachingRecommendation } from "./types";

class IntelligentCoach {
  async getPersonalizedCoaching(userId: string, context?: any): Promise<CoachingRecommendation> {
    const userContext = await this.getCoachingContext(userId);
    
    const systemMessage = `You are an expert wellness coach with deep knowledge of psychology, 
    behavioral change, and personalized intervention strategies. Provide supportive, actionable 
    coaching that meets users where they are in their wellness journey.`;

    const prompt = `Provide personalized coaching for this user:
    Context: ${JSON.stringify(userContext)}
    ${context ? `Additional context: ${JSON.stringify(context)}` : ''}
    
    Generate coaching recommendation as JSON:
    - coachingType: motivational|instructional|supportive|challenging|emergency
    - message: personalized coaching message
    - tone: encouraging|gentle|direct|empathetic|celebratory
    - actionSteps: 2-4 specific, achievable actions
    - followUpQuestions: questions to promote reflection
    - resources: helpful resources or techniques
    - timingOptimal: whether this is good timing for this user`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.6);
    const coaching = JSON.parse(response);

    return {
      ...coaching,
      id: `coaching_${Date.now()}`,
    };
  }

  async generateInterventions(userId: string, riskLevel: string): Promise<CoachingRecommendation[]> {
    const userContext = await this.getCoachingContext(userId);
    
    const systemMessage = `You are a crisis intervention specialist creating appropriate 
    interventions based on risk level. Prioritize user safety while providing hope and practical support.`;

    const prompt = `Generate ${riskLevel} risk interventions for this user:
    ${JSON.stringify(userContext)}
    
    Risk level: ${riskLevel}
    
    Create 2-3 intervention recommendations prioritizing:
    1. Immediate safety and support
    2. Practical coping strategies
    3. Professional resource connections
    4. Follow-up and monitoring
    
    Each intervention should have appropriate urgency and tone for the risk level.`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.3);
    const interventions = JSON.parse(response);

    return interventions.map((intervention: any, index: number) => ({
      ...intervention,
      id: `intervention_${Date.now()}_${index}`,
    }));
  }

  async generateProgressCelebration(userId: string): Promise<CoachingRecommendation> {
    const progressData = await this.getProgressData(userId);
    
    const systemMessage = `You are a positive psychology coach specializing in celebrating 
    progress and building motivation. Focus on specific achievements and encouraging continued growth.`;

    const prompt = `Create a progress celebration message based on this data:
    ${JSON.stringify(progressData)}
    
    Highlight specific improvements and encourage continued growth.
    Make it personal and meaningful.`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.7);
    const celebration = JSON.parse(response);

    return {
      ...celebration,
      id: `celebration_${Date.now()}`,
      coachingType: 'motivational',
      tone: 'celebratory'
    };
  }

  private async getCoachingContext(userId: string) {
    const timeFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [profile, recentCheckins, recentJournals, patterns] = await Promise.all([
      supabase
        .from('profiles')
        .select('focus_areas, full_name')
        .eq('id', userId)
        .single(),

      supabase
        .from('daily_checkins')
        .select('mood_score, stress_level, energy_level, created_at')
        .eq('user_id', userId)
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false })
        .limit(5),

      supabase
        .from('journal_entries')
        .select('mood_score, created_at, ai_summary')
        .eq('user_id', userId)
        .gte('created_at', timeFilter)
        .order('created_at', { ascending: false })
        .limit(3),

      supabase
        .from('assessment_patterns')
        .select('category, avg_score, trend_direction')
        .eq('user_id', userId)
    ]);

    return {
      profile: profile.data,
      recentCheckins: recentCheckins.data || [],
      recentJournals: recentJournals.data || [],
      patterns: patterns.data || [],
      currentTime: new Date().toISOString(),
      timeOfDay: this.getTimeOfDay()
    };
  }

  private async getProgressData(userId: string) {
    // Get data for the last 30 days to show progress
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const [recentPatterns, journalCount, checkinCount] = await Promise.all([
      supabase
        .from('assessment_patterns')
        .select('*')
        .eq('user_id', userId),

      supabase
        .from('journal_entries')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo),

      supabase
        .from('daily_checkins')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo)
    ]);

    return {
      assessmentPatterns: recentPatterns.data || [],
      journalEntriesCount: journalCount.data?.length || 0,
      checkinsCount: checkinCount.data?.length || 0,
      timeframe: '30 days'
    };
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
}

export const intelligentCoach = new IntelligentCoach();
