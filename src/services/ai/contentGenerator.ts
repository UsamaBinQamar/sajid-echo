
import { openAIService } from "./openAIService";
import { supabase } from "@/integrations/supabase/client";
import { ContentRecommendation } from "./types";

class ContentGenerator {
  async generateJournalPrompt(userId: string, context?: any): Promise<ContentRecommendation> {
    // Get user's recent patterns and preferences
    const userContext = await this.getUserContext(userId);
    
    const systemMessage = `You are an expert wellness coach specializing in personalized journaling prompts. 
    Generate thoughtful, engaging prompts that help users reflect on their experiences and emotions.
    Consider the user's recent mood patterns, stress levels, and focus areas.`;

    const prompt = `Based on this user context: ${JSON.stringify(userContext)}
    ${context ? `Additional context: ${JSON.stringify(context)}` : ''}
    
    Generate a personalized journaling prompt that:
    1. Is relevant to their current emotional state
    2. Encourages meaningful reflection
    3. Aligns with their wellness goals
    4. Is appropriate for their current stress level
    
    Return a JSON object with: title, content, personalizedReason, tags, estimatedDuration`;

    const response = await openAIService.generateCompletion(prompt, systemMessage);
    const generatedContent = JSON.parse(response);

    return {
      id: `prompt_${Date.now()}`,
      type: 'prompt',
      title: generatedContent.title,
      content: generatedContent.content,
      personalizedReason: generatedContent.personalizedReason,
      tags: generatedContent.tags || [],
      estimatedDuration: generatedContent.estimatedDuration || 10,
      adaptiveContent: true
    };
  }

  async generateWellnessContent(userId: string, contentType: string): Promise<ContentRecommendation> {
    const userContext = await this.getUserContext(userId);
    
    const systemMessage = `You are a wellness expert creating personalized ${contentType} content.
    Focus on evidence-based approaches and practical, actionable advice.`;

    const prompt = `Create personalized ${contentType} content for a user with this context: ${JSON.stringify(userContext)}
    
    Content should be:
    1. Scientifically grounded
    2. Actionable and practical
    3. Appropriate for their current wellness level
    4. Engaging and motivating
    
    Return JSON with: title, content, description, tags, difficulty, estimatedDuration`;

    const response = await openAIService.generateCompletion(prompt, systemMessage);
    const generatedContent = JSON.parse(response);

    return {
      id: `content_${Date.now()}`,
      type: contentType as any,
      title: generatedContent.title,
      content: generatedContent.content,
      description: generatedContent.description,
      personalizedReason: `Tailored for your current wellness journey and ${contentType} preferences`,
      tags: generatedContent.tags || [],
      difficulty: generatedContent.difficulty || 'beginner',
      estimatedDuration: generatedContent.estimatedDuration || 15,
      adaptiveContent: true
    };
  }

  private async getUserContext(userId: string) {
    // Get recent check-ins
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent journal entries
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('content, mood_score, tags')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(3);

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('focus_areas')
      .eq('id', userId)
      .single();

    return {
      recentCheckins: checkins || [],
      recentJournals: journals || [],
      focusAreas: profile?.focus_areas || [],
      timeOfDay: this.getTimeOfDay(),
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
    };
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }
}

export const contentGenerator = new ContentGenerator();
