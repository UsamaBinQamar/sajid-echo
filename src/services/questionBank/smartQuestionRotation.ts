import { supabase } from "@/integrations/supabase/client";
import { SmartQuestion } from "@/components/dashboard/smart-assessment/types";

export interface QuestionRotationContext {
  userId: string;
  recentQuestionHistory: Array<{
    question_id: string;
    asked_date: string;
    category: string;
  }>;
  userStressPatterns: Array<{
    date: string;
    stress_level: number;
    mood_score: number;
  }>;
  focusAreas: string[];
  dayOfWeek: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

// Extend SmartQuestion to include category for internal processing
interface SmartQuestionWithCategory extends SmartQuestion {
  category: string;
}

export class SmartQuestionRotation {
  private static readonly ROTATION_WEIGHTS = {
    FRESHNESS: 0.4,       // Haven't asked recently
    RELEVANCE: 0.3,       // Matches user patterns/focus areas
    BALANCE: 0.2,         // Maintains category diversity
    TIMING: 0.1           // Appropriate for time/day
  };

  static async getOptimalQuestionMix(
    userId: string,
    targetQuestionCount: number,
    quickMode: boolean = false
  ): Promise<SmartQuestion[]> {
    console.log('🎯 Getting optimal question mix for user:', userId);
    
    try {
      // Build rotation context
      const context = await this.buildRotationContext(userId);
      
      // Get available question pool
      const availableQuestions = await this.getAvailableQuestionPool();
      
      // Score questions based on rotation algorithm
      const scoredQuestions = this.scoreQuestionsForRotation(
        availableQuestions,
        context,
        quickMode
      );
      
      // Select optimal mix
      const selectedQuestions = this.selectOptimalMix(
        scoredQuestions,
        targetQuestionCount,
        context
      );
      
      console.log('✅ Optimal question mix selected:', {
        total: selectedQuestions.length,
        categories: selectedQuestions.map(q => q.category || 'unknown')
      });
      
      return selectedQuestions;
      
    } catch (error) {
      console.error('❌ Error in question rotation:', error);
      // Fallback to basic question set
      return this.getFallbackQuestions(targetQuestionCount);
    }
  }

  private static async buildRotationContext(userId: string): Promise<QuestionRotationContext> {
    // Get recent question history (last 14 days)
    const { data: recentHistory } = await supabase
      .from('question_responses')
      .select(`
        question_id,
        created_at,
        assessment_questions(category)
      `)
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    // Get recent stress/mood patterns
    const { data: stressPatterns } = await supabase
      .from('daily_checkins')
      .select('date, stress_level, mood_score')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    // Get user focus areas
    const { data: profile } = await supabase
      .from('profiles')
      .select('focus_areas')
      .eq('id', userId)
      .single();

    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now);

    return {
      userId,
      recentQuestionHistory: (recentHistory || []).map(h => ({
        question_id: h.question_id,
        asked_date: h.created_at,
        category: h.assessment_questions?.category || 'unknown'
      })),
      userStressPatterns: stressPatterns || [],
      focusAreas: profile?.focus_areas || [],
      dayOfWeek: now.getDay(),
      timeOfDay
    };
  }

  private static async getAvailableQuestionPool(): Promise<SmartQuestionWithCategory[]> {
    // This would be expanded to include more diverse questions
    // For now, return core wellness questions with rotation metadata
    return [
      {
        id: 'mood',
        type: 'mood',
        question: 'How would you rate your overall mood today?',
        icon: 'smile',
        emojis: ["😟", "😐", "🙂", "😊", "😁"],
        value: null,
        required: true,
        category: 'wellness'
      },
      {
        id: 'stress',
        type: 'stress',
        question: 'What is your current stress level?',
        icon: 'zap',
        emojis: ["😌", "😐", "😓", "😰", "😵"],
        value: null,
        required: true,
        category: 'wellness'
      },
      {
        id: 'energy',
        type: 'energy',
        question: 'How would you describe your energy level today?',
        icon: 'battery',
        emojis: ["😴", "😑", "🙂", "😊", "⚡"],
        value: null,
        required: true,
        category: 'wellness'
      },
      {
        id: 'work_satisfaction',
        type: 'mood',
        question: 'How satisfied do you feel with your work today?',
        icon: 'smile',
        emojis: ["😞", "😐", "🙂", "😊", "🤩"],
        value: null,
        required: true,
        category: 'work'
      },
      {
        id: 'social_connection',
        type: 'mood',
        question: 'How connected do you feel to your colleagues today?',
        icon: 'smile',
        emojis: ["😔", "😐", "🙂", "😊", "🤗"],
        value: null,
        required: true,
        category: 'social'
      }
    ];
  }

  private static scoreQuestionsForRotation(
    questions: SmartQuestionWithCategory[],
    context: QuestionRotationContext,
    quickMode: boolean
  ): Array<SmartQuestionWithCategory & { rotationScore: number }> {
    return questions.map(question => {
      let score = 0;
      
      // Freshness score - boost questions not asked recently
      const daysSinceAsked = this.getDaysSinceLastAsked(question.id, context.recentQuestionHistory);
      const freshnessScore = Math.min(daysSinceAsked / 7, 1) * this.ROTATION_WEIGHTS.FRESHNESS;
      
      // Relevance score - boost questions matching focus areas or stress patterns
      const relevanceScore = this.calculateRelevanceScore(question, context) * this.ROTATION_WEIGHTS.RELEVANCE;
      
      // Balance score - encourage category diversity
      const balanceScore = this.calculateBalanceScore(question, context) * this.ROTATION_WEIGHTS.BALANCE;
      
      // Timing score - appropriate for time of day
      const timingScore = this.calculateTimingScore(question, context) * this.ROTATION_WEIGHTS.TIMING;
      
      score = freshnessScore + relevanceScore + balanceScore + timingScore;
      
      // Quick mode adjustments
      if (quickMode && question.category === 'wellness') {
        score *= 1.2; // Boost core wellness questions in quick mode
      }
      
      return {
        ...question,
        rotationScore: Number(score.toFixed(3))
      };
    });
  }

  private static selectOptimalMix(
    scoredQuestions: Array<SmartQuestionWithCategory & { rotationScore: number }>,
    targetCount: number,
    context: QuestionRotationContext
  ): SmartQuestion[] {
    // Sort by rotation score
    const sorted = scoredQuestions.sort((a, b) => b.rotationScore - a.rotationScore);
    
    // Ensure we always include at least one wellness question
    const selected: SmartQuestion[] = [];
    const usedCategories = new Set<string>();
    
    // First pass: ensure core wellness questions
    for (const question of sorted) {
      if (selected.length >= targetCount) break;
      
      if (question.category === 'wellness' && !usedCategories.has('wellness')) {
        selected.push(question);
        usedCategories.add('wellness');
      }
    }
    
    // Second pass: fill remaining slots with highest scored questions
    for (const question of sorted) {
      if (selected.length >= targetCount) break;
      
      if (!selected.includes(question)) {
        selected.push(question);
      }
    }
    
    return selected.slice(0, targetCount);
  }

  private static getDaysSinceLastAsked(
    questionId: string,
    history: Array<{ question_id: string; asked_date: string }>
  ): number {
    const lastAsked = history.find(h => h.question_id === questionId);
    if (!lastAsked) return 999; // Never asked
    
    const daysDiff = Math.floor(
      (Date.now() - new Date(lastAsked.asked_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff;
  }

  private static calculateRelevanceScore(
    question: SmartQuestionWithCategory,
    context: QuestionRotationContext
  ): number {
    let score = 0.5; // Base relevance
    
    // Boost if matches focus areas
    if (context.focusAreas.includes(question.category)) {
      score += 0.3;
    }
    
    // Boost stress-related questions if user has high stress patterns
    const recentHighStress = context.userStressPatterns.some(p => p.stress_level >= 4);
    if (recentHighStress && question.type === 'stress') {
      score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  private static calculateBalanceScore(
    question: SmartQuestionWithCategory,
    context: QuestionRotationContext
  ): number {
    // Count recent category usage
    const categoryUsage = context.recentQuestionHistory
      .filter(h => h.category === question.category)
      .length;
    
    // Boost underused categories
    return Math.max(0.1, 1 - (categoryUsage * 0.2));
  }

  private static calculateTimingScore(
    question: SmartQuestion,
    context: QuestionRotationContext
  ): number {
    let score = 0.5; // Base timing score
    
    // Morning: boost energy questions
    if (context.timeOfDay === 'morning' && question.type === 'energy') {
      score += 0.3;
    }
    
    // Evening: boost stress/mood reflection
    if (context.timeOfDay === 'evening' && (question.type === 'stress' || question.type === 'mood')) {
      score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  private static getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private static getFallbackQuestions(count: number): SmartQuestion[] {
    const fallback: SmartQuestion[] = [
      {
        id: 'mood',
        type: 'mood',
        question: 'How are you feeling today?',
        icon: 'smile',
        emojis: ["😟", "😐", "🙂", "😊", "😁"],
        value: null,
        required: true
      },
      {
        id: 'stress',
        type: 'stress',
        question: 'What is your stress level right now?',
        icon: 'zap',
        emojis: ["😌", "😐", "😓", "😰", "😵"],
        value: null,
        required: true
      }
    ];
    
    return fallback.slice(0, count);
  }
}
