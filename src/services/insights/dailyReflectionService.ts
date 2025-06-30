
import { supabase } from "@/integrations/supabase/client";
import { openAIService } from "@/services/ai/openAIService";

export interface DailyReflection {
  id: string;
  date: string;
  type: 'checkin' | 'assessment';
  responses: number;
  averageScore: number;
  categories: string[];
  reflectionText: string;
  emotionalTone: 'breakthrough' | 'growth' | 'steady' | 'challenging' | 'difficult';
  growthInsight?: string;
  coachingSuggestion?: string;
}

export interface ReflectionContext {
  dayData: {
    date: string;
    type: 'checkin' | 'assessment';
    responses: number;
    averageScore: number;
    categories: string[];
    specificScores?: {
      mood?: number;
      stress?: number;
      energy?: number;
    };
  };
  userPatterns: {
    recentTrend: 'improving' | 'declining' | 'stable';
    averageScore: number;
    strongCategories: string[];
    challengingCategories: string[];
  };
  contextualFactors: {
    dayOfWeek: string;
    isWeekend: boolean;
    streakDay?: number;
  };
}

class DailyReflectionService {
  private reflectionCache = new Map<string, DailyReflection>();

  async generateDailyReflection(context: ReflectionContext): Promise<DailyReflection> {
    const cacheKey = `${context.dayData.date}-${context.dayData.type}`;
    
    // Check cache first
    if (this.reflectionCache.has(cacheKey)) {
      return this.reflectionCache.get(cacheKey)!;
    }

    try {
      const reflectionText = await this.generateReflectionText(context);
      const emotionalTone = this.determineEmotionalTone(context);
      const growthInsight = await this.generateGrowthInsight(context);
      const coachingSuggestion = this.generateCoachingSuggestion(context);

      const reflection: DailyReflection = {
        id: `reflection-${context.dayData.date}`,
        date: context.dayData.date,
        type: context.dayData.type,
        responses: context.dayData.responses,
        averageScore: context.dayData.averageScore,
        categories: context.dayData.categories,
        reflectionText,
        emotionalTone,
        growthInsight,
        coachingSuggestion
      };

      // Cache the reflection
      this.reflectionCache.set(cacheKey, reflection);
      return reflection;
    } catch (error) {
      console.error('Error generating daily reflection:', error);
      return this.getFallbackReflection(context);
    }
  }

  private async generateReflectionText(context: ReflectionContext): Promise<string> {
    const { dayData, userPatterns, contextualFactors } = context;
    
    const prompt = `Generate a warm, encouraging single sentence reflection for a user's daily wellness check-in.

Context:
- Date: ${dayData.date} (${contextualFactors.dayOfWeek})
- Average score: ${dayData.averageScore}/5
- Categories: ${dayData.categories.join(', ')}
- Recent trend: ${userPatterns.recentTrend}
- Strong areas: ${userPatterns.strongCategories.join(', ')}
- Growth areas: ${userPatterns.challengingCategories.join(', ')}

Guidelines:
- Keep it personal and encouraging (30-50 words)
- Reference specific strengths or growth when applicable
- Use growth-minded language
- Avoid clinical or overly positive tone
- Make it feel like a supportive friend's observation

Examples:
- "A day of steady progress with strong self-awareness in emotional regulation"
- "Navigating challenges with resilience while building strength in communication"
- "A breakthrough moment in stress management with growing confidence"`;

    try {
      const reflection = await openAIService.generateCompletion(
        prompt,
        "You are a compassionate wellness coach who helps people reflect on their growth journey.",
        0.7
      );
      return reflection.trim().replace(/^"|"$/g, ''); // Remove quotes if present
    } catch (error) {
      console.error('Error generating reflection text:', error);
      return this.getSimpleReflection(context);
    }
  }

  private determineEmotionalTone(context: ReflectionContext): DailyReflection['emotionalTone'] {
    const { averageScore } = context.dayData;
    const { recentTrend } = context.userPatterns;

    if (averageScore >= 4.5) return 'breakthrough';
    if (averageScore >= 3.5 && recentTrend === 'improving') return 'growth';
    if (averageScore >= 3.0) return 'steady';
    if (averageScore >= 2.0) return 'challenging';
    return 'difficult';
  }

  private async generateGrowthInsight(context: ReflectionContext): Promise<string | undefined> {
    if (context.userPatterns.recentTrend === 'improving' || context.dayData.averageScore >= 4.0) {
      const insight = `Your ${context.userPatterns.strongCategories[0] || 'wellness'} awareness is growing stronger`;
      return insight;
    }
    return undefined;
  }

  private generateCoachingSuggestion(context: ReflectionContext): string | undefined {
    if (context.dayData.averageScore < 3.0 && context.userPatterns.challengingCategories.length > 0) {
      return `Consider focusing on ${context.userPatterns.challengingCategories[0]} support today`;
    }
    return undefined;
  }

  private getSimpleReflection(context: ReflectionContext): string {
    const { averageScore, type } = context.dayData;
    
    if (averageScore >= 4.0) {
      return "A strong day of self-awareness and positive growth";
    } else if (averageScore >= 3.0) {
      return "Steady progress with mindful attention to your wellbeing";
    } else {
      return "Showing courage by checking in during a challenging time";
    }
  }

  private getFallbackReflection(context: ReflectionContext): DailyReflection {
    return {
      id: `reflection-${context.dayData.date}`,
      date: context.dayData.date,
      type: context.dayData.type,
      responses: context.dayData.responses,
      averageScore: context.dayData.averageScore,
      categories: context.dayData.categories,
      reflectionText: this.getSimpleReflection(context),
      emotionalTone: this.determineEmotionalTone(context)
    };
  }

  clearCache() {
    this.reflectionCache.clear();
  }
}

export const dailyReflectionService = new DailyReflectionService();
