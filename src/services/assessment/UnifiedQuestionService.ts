import { SmartQuestion } from "@/components/dashboard/smart-assessment/types";
import { DynamicQuestionSelector } from "@/services/leadershipAssessment/DynamicQuestionSelector";
import { questionGenerator } from "@/services/assessment/questionGenerator";
import { SmartQuestionRotation } from "@/services/questionBank/smartQuestionRotation";
import { EnhancedQuestionPool } from "@/services/questionBank/enhancedQuestionPool";
import { supabase } from "@/integrations/supabase/client";

export class UnifiedQuestionService {
  private static readonly FALLBACK_QUESTIONS_LIMIT = 5;
  private static readonly DEFAULT_TOTAL_QUESTIONS_QUICK = 5;
  private static readonly DEFAULT_TOTAL_QUESTIONS_FULL = 8;

  static async generateQuestionsForAssessment(
    userId: string,
    quickMode: boolean = false,
    focusAreas: string[] = []
  ): Promise<SmartQuestion[]> {
    console.log('🎯 Generating enhanced unified questions for user:', userId, {
      quickMode,
      focusAreas,
      timestamp: new Date().toISOString()
    });
    
    try {
      const totalQuestions = quickMode ? this.DEFAULT_TOTAL_QUESTIONS_QUICK : this.DEFAULT_TOTAL_QUESTIONS_FULL;
      
      // Phase 2 Enhancement: Use smart question rotation
      const smartQuestions = await this.getSmartRotatedQuestions(
        userId,
        Math.min(4, totalQuestions),
        quickMode,
        focusAreas
      );

      let allQuestions: SmartQuestion[] = [...smartQuestions];
      
      // Add leadership questions if we have slots available
      const remainingSlots = totalQuestions - allQuestions.length;
      if (remainingSlots > 0) {
        try {
          const leadershipQuestions = await this.getLeadershipQuestionsWithFallback(
            userId,
            focusAreas,
            remainingSlots
          );
          allQuestions = [...allQuestions, ...leadershipQuestions];
          
          console.log('✅ Successfully added leadership questions:', leadershipQuestions.length);
        } catch (leadershipError) {
          console.error('⚠️ Leadership questions failed, using enhanced fallback:', leadershipError);
          
          // Phase 2 Enhancement: Better fallback using enhanced question pool
          const enhancedFallback = this.getEnhancedFallbackQuestions(
            userId,
            remainingSlots,
            focusAreas
          );
          allQuestions = [...allQuestions, ...enhancedFallback];
        }
      }
      
      // Validate final question set
      const validatedQuestions = this.validateQuestionSet(allQuestions);
      
      console.log('🎉 Enhanced question set generated:', {
        total: validatedQuestions.length,
        types: validatedQuestions.map(q => q.type),
        ids: validatedQuestions.map(q => q.id),
        smartRotationUsed: smartQuestions.length > 0
      });
      
      return validatedQuestions;
      
    } catch (error) {
      console.error('❌ Critical error in enhanced question generation:', error);
      
      // Ultimate fallback - return basic wellness questions
      const fallbackQuestions = this.getCoreWellnessQuestions();
      console.log('🆘 Using emergency fallback questions:', fallbackQuestions.length);
      
      return fallbackQuestions;
    }
  }

  private static async getSmartRotatedQuestions(
    userId: string,
    targetCount: number,
    quickMode: boolean,
    focusAreas: string[]
  ): Promise<SmartQuestion[]> {
    try {
      console.log('🔄 Using smart question rotation...');
      
      // Get user patterns for context
      const userPatterns = await this.getUserPatterns(userId);
      const timeContext = this.getTimeContext();
      
      // Use enhanced question pool for contextual questions
      const contextualQuestions = EnhancedQuestionPool.getQuestionsForContext(
        userId,
        timeContext.timeOfDay,
        timeContext.dayType,
        {
          recent_mood: userPatterns.avgMood,
          recent_stress: userPatterns.avgStress,
          recent_energy: userPatterns.avgEnergy,
          focus_areas: focusAreas
        },
        targetCount
      );
      
      if (contextualQuestions.length > 0) {
        console.log('✅ Using enhanced contextual questions:', contextualQuestions.length);
        return contextualQuestions;
      }
      
      // Fallback to smart rotation algorithm
      return await SmartQuestionRotation.getOptimalQuestionMix(
        userId,
        targetCount,
        quickMode
      );
      
    } catch (error) {
      console.error('⚠️ Smart rotation failed, using basic questions:', error);
      return this.getCoreWellnessQuestions().slice(0, targetCount);
    }
  }

  private static async getUserPatterns(userId: string) {
    try {
      // Get recent patterns from daily checkins
      const { data: recentCheckins } = await supabase
        .from('daily_checkins')
        .select('mood_score, stress_level, energy_level')
        .eq('user_id', userId)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false })
        .limit(7);

      if (!recentCheckins || recentCheckins.length === 0) {
        return { avgMood: 3, avgStress: 3, avgEnergy: 3 };
      }

      const avgMood = recentCheckins.reduce((sum, c) => sum + (c.mood_score || 3), 0) / recentCheckins.length;
      const avgStress = recentCheckins.reduce((sum, c) => sum + (c.stress_level || 3), 0) / recentCheckins.length;
      const avgEnergy = recentCheckins.reduce((sum, c) => sum + (c.energy_level || 3), 0) / recentCheckins.length;

      return { avgMood, avgStress, avgEnergy };
      
    } catch (error) {
      console.error('⚠️ Failed to get user patterns:', error);
      return { avgMood: 3, avgStress: 3, avgEnergy: 3 };
    }
  }

  private static getTimeContext(): { timeOfDay: 'morning' | 'afternoon' | 'evening'; dayType: 'weekday' | 'weekend' } {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 18) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';
    
    const dayType: 'weekday' | 'weekend' = (dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : 'weekday';
    
    return { timeOfDay, dayType };
  }

  private static getEnhancedFallbackQuestions(
    userId: string,
    count: number,
    focusAreas: string[]
  ): SmartQuestion[] {
    // Use enhanced question pool for better fallback
    const categories = EnhancedQuestionPool.getAllCategories();
    const questions: SmartQuestion[] = [];
    
    // Try to get questions from relevant categories
    for (const category of categories) {
      if (questions.length >= count) break;
      
      const categoryQuestions = EnhancedQuestionPool.getQuestionsByCategory(category);
      if (categoryQuestions.length > 0) {
        questions.push(categoryQuestions[0]);
      }
    }
    
    // Fill remaining with core wellness if needed
    while (questions.length < count) {
      const coreQuestions = this.getCoreWellnessQuestions();
      const nextQuestion = coreQuestions[questions.length % coreQuestions.length];
      if (!questions.some(q => q.id === nextQuestion.id)) {
        questions.push(nextQuestion);
      } else {
        break;
      }
    }
    
    return questions.slice(0, count);
  }
  
  private static getCoreWellnessQuestions(): SmartQuestion[] {
    try {
      return questionGenerator.createMoodQuestions();
    } catch (error) {
      console.error('❌ Failed to get core wellness questions:', error);
      
      // Hardcoded emergency fallback
      return [
        {
          id: 'mood',
          type: 'mood',
          question: 'How would you rate your overall mood today?',
          icon: 'smile',
          emojis: ["😟", "😐", "🙂", "😊", "😁"],
          value: null,
          required: true
        },
        {
          id: 'stress',
          type: 'stress', 
          question: 'How stressed do you feel right now?',
          icon: 'zap',
          emojis: ["😌", "😐", "😓", "😰", "😵"],
          value: null,
          required: true
        },
        {
          id: 'energy',
          type: 'energy',
          question: 'What is your energy level today?',
          icon: 'battery',
          emojis: ["😴", "😑", "🙂", "😊", "⚡"],
          value: null,
          required: true
        }
      ];
    }
  }
  
  private static getWellnessFallbackQuestions(count: number): SmartQuestion[] {
    const fallbackQuestions: SmartQuestion[] = [
      {
        id: 'work_satisfaction',
        type: 'mood',
        question: 'How satisfied are you with your work today?',
        icon: 'smile',
        emojis: ["😞", "😐", "🙂", "😊", "🤩"],
        value: null,
        required: true
      },
      {
        id: 'focus_level',
        type: 'energy',
        question: 'How focused do you feel right now?',
        icon: 'battery',
        emojis: ["😵‍💫", "😐", "🧐", "🎯", "⚡"],
        value: null,
        required: true
      }
    ];
    
    return fallbackQuestions.slice(0, count);
  }
  
  private static getWorkLifeBalanceQuestions(quickMode: boolean): SmartQuestion[] {
    try {
      return questionGenerator.createWorkLifeBalanceQuestions(quickMode);
    } catch (error) {
      console.error('⚠️ Failed to get work-life balance questions:', error);
      return [];
    }
  }
  
  private static async getLeadershipQuestionsWithFallback(
    userId: string,
    focusAreas: string[],
    count: number
  ): Promise<SmartQuestion[]> {
    try {
      // Get recommended category with error handling
      const recommendedCategory = await this.getRecommendedCategoryWithFallback(userId, focusAreas);
      console.log('🎯 Recommended category:', recommendedCategory);
      
      // Get dynamic leadership questions
      const leadershipQuestions = await this.getLeadershipQuestions(
        userId,
        recommendedCategory,
        count
      );
      
      if (leadershipQuestions.length === 0) {
        throw new Error('No leadership questions returned from selector');
      }
      
      return leadershipQuestions;
      
    } catch (error) {
      console.error('⚠️ Leadership question selection failed:', error);
      throw error; // Re-throw to trigger fallback in caller
    }
  }
  
  private static async getRecommendedCategoryWithFallback(
    userId: string,
    focusAreas: string[]
  ): Promise<string> {
    try {
      // Try to get user's recent assessment patterns
      const { data: patterns, error } = await supabase
        .from('assessment_patterns')
        .select('category, avg_score, last_low_score_date')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.warn('⚠️ Could not fetch assessment patterns:', error);
      }
      
      // Prioritize categories where user scored low recently
      if (patterns && patterns.length > 0) {
        const recentLowScore = patterns.find(p => 
          p.avg_score < 3 && 
          p.last_low_score_date && 
          new Date(p.last_low_score_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        
        if (recentLowScore) {
          console.log('📉 Found recent low-scoring category:', recentLowScore.category);
          return recentLowScore.category;
        }
      }
      
      // Fallback to user's focus areas
      if (focusAreas && focusAreas.length > 0) {
        const category = focusAreas[0].toLowerCase().replace(/\s+/g, '_');
        console.log('🎯 Using focus area category:', category);
        return category;
      }
      
      // Default rotation based on day of week
      return this.getDefaultCategoryRotation();
      
    } catch (error) {
      console.error('❌ Error getting recommended category:', error);
      return this.getDefaultCategoryRotation();
    }
  }
  
  private static getDefaultCategoryRotation(): string {
    const categories = [
      'values_alignment',
      'emotional_energy',
      'authenticity',
      'boundaries_boldness',
      'voice_visibility',
      'bias_navigation'
    ];
    
    const dayOfWeek = new Date().getDay();
    const category = categories[dayOfWeek % categories.length];
    console.log('🔄 Using default category rotation:', category);
    return category;
  }
  
  private static async getLeadershipQuestions(
    userId: string,
    category: string,
    count: number
  ): Promise<SmartQuestion[]> {
    try {
      console.log('🔍 Fetching leadership questions for category:', category);
      
      const assessmentQuestions = await DynamicQuestionSelector.getQuestionsForAssessment(
        userId,
        category,
        count
      );
      
      if (!assessmentQuestions || assessmentQuestions.length === 0) {
        console.warn('⚠️ No assessment questions returned from DynamicQuestionSelector');
        return [];
      }
      
      const smartQuestions = assessmentQuestions.map((q, index) => 
        this.convertToSmartQuestionWithValidation(q, index)
      ).filter(Boolean) as SmartQuestion[];
      
      console.log('✅ Converted leadership questions:', smartQuestions.length);
      return smartQuestions;
      
    } catch (error) {
      console.error('❌ Error getting leadership questions:', error);
      return [];
    }
  }
  
  private static convertToSmartQuestionWithValidation(assessmentQuestion: any, index: number): SmartQuestion | null {
    try {
      if (!assessmentQuestion || !assessmentQuestion.key || !assessmentQuestion.text) {
        console.warn('⚠️ Invalid assessment question structure:', assessmentQuestion);
        return null;
      }
      
      const baseQuestion: SmartQuestion = {
        id: assessmentQuestion.key,
        type: assessmentQuestion.type || 'multiple_choice',
        question: assessmentQuestion.text,
        icon: this.getIconForQuestionType(assessmentQuestion.type || 'multiple_choice'),
        emojis: assessmentQuestion.emojis || ["😟", "😐", "🙂", "😊", "😁"],
        value: null,
        required: true
      };
      
      // Add question-specific properties with validation
      if (assessmentQuestion.options && Array.isArray(assessmentQuestion.options)) {
        (baseQuestion as any).options = assessmentQuestion.options;
      }
      
      if (typeof assessmentQuestion.multiple_select === 'boolean') {
        (baseQuestion as any).multiple_select = assessmentQuestion.multiple_select;
      }
      
      if (typeof assessmentQuestion.min === 'number') {
        (baseQuestion as any).min = assessmentQuestion.min;
      }
      
      if (typeof assessmentQuestion.max === 'number') {
        (baseQuestion as any).max = assessmentQuestion.max;
      }
      
      return baseQuestion;
      
    } catch (error) {
      console.error('❌ Error converting assessment question:', error, assessmentQuestion);
      return null;
    }
  }
  
  private static getIconForQuestionType(type: string): string {
    const iconMap: Record<string, string> = {
      'multiple_choice': 'users',
      'slider': 'scale',
      'ranking': 'scale',
      'action_commitment': 'users',
      'mood': 'smile',
      'stress': 'zap',
      'energy': 'battery',
      'work_life_balance': 'scale'
    };
    
    return iconMap[type] || 'smile';
  }
  
  private static validateQuestionSet(questions: SmartQuestion[]): SmartQuestion[] {
    const validQuestions = questions.filter(question => {
      if (!question || !question.id || !question.question) {
        console.warn('⚠️ Filtering out invalid question:', question);
        return false;
      }
      return true;
    });
    
    // Ensure no duplicate question IDs
    const seenIds = new Set<string>();
    const uniqueQuestions = validQuestions.filter(question => {
      if (seenIds.has(question.id)) {
        console.warn('⚠️ Filtering out duplicate question ID:', question.id);
        return false;
      }
      seenIds.add(question.id);
      return true;
    });
    
    console.log('✅ Question validation complete:', {
      original: questions.length,
      afterValidation: validQuestions.length,
      afterDeduplication: uniqueQuestions.length
    });
    
    return uniqueQuestions;
  }
}
