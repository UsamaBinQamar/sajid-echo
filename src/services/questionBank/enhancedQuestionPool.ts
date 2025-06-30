
import { SmartQuestion } from "@/components/dashboard/smart-assessment/types";

export interface EnhancedQuestionMetadata {
  frequency: 'daily' | 'weekly' | 'contextual';
  triggers: {
    stress_threshold?: number;
    mood_threshold?: number;
    energy_threshold?: number;
    focus_areas?: string[];
    time_conditions?: Array<'morning' | 'afternoon' | 'evening'>;
    day_conditions?: Array<'weekday' | 'weekend'>;
  };
  weight: number;
  category: string;
  subcategory?: string;
}

export type EnhancedSmartQuestion = SmartQuestion & {
  metadata: EnhancedQuestionMetadata;
};

export class EnhancedQuestionPool {
  private static readonly QUESTION_BANK: EnhancedSmartQuestion[] = [
    // Core Wellness Questions
    {
      id: 'mood_general',
      type: 'mood',
      question: 'How would you describe your overall mood today?',
      icon: 'smile',
      emojis: ["😫", "😟", "😐", "😊", "😁"],
      value: null,
      required: true,
      metadata: {
        frequency: 'daily',
        triggers: {},
        weight: 10,
        category: 'wellness',
        subcategory: 'emotional'
      }
    },
    {
      id: 'energy_morning',
      type: 'energy',
      question: 'How energized do you feel to start your day?',
      icon: 'battery',
      emojis: ["😴", "😪", "😐", "⚡", "🚀"],
      value: null,
      required: true,
      metadata: {
        frequency: 'daily',
        triggers: {
          time_conditions: ['morning']
        },
        weight: 8,
        category: 'wellness',
        subcategory: 'physical'
      }
    },
    {
      id: 'energy_afternoon',
      type: 'energy',
      question: 'How is your energy holding up this afternoon?',
      icon: 'battery',
      emojis: ["😴", "😓", "😐", "😊", "⚡"],
      value: null,
      required: true,
      metadata: {
        frequency: 'daily',
        triggers: {
          time_conditions: ['afternoon']
        },
        weight: 7,
        category: 'wellness',
        subcategory: 'physical'
      }
    },
    {
      id: 'stress_workload',
      type: 'stress',
      question: 'How manageable does your workload feel today?',
      icon: 'zap',
      emojis: ["😰", "😓", "😐", "🙂", "😌"],
      value: null,
      required: true,
      metadata: {
        frequency: 'daily',
        triggers: {
          day_conditions: ['weekday'],
          focus_areas: ['work_boundaries', 'stress_management']
        },
        weight: 9,
        category: 'work',
        subcategory: 'workload'
      }
    },
    {
      id: 'stress_evening_reflection',
      type: 'stress',
      question: 'How well did you manage stress throughout the day?',
      icon: 'zap',
      emojis: ["😵", "😰", "😐", "😌", "🧘"],
      value: null,
      required: true,
      metadata: {
        frequency: 'daily',
        triggers: {
          time_conditions: ['evening']
        },
        weight: 8,
        category: 'wellness',
        subcategory: 'reflection'
      }
    },

    // Work-Life Balance Questions
    {
      id: 'wlb_boundaries',
      type: 'work_life_balance',
      question: 'How well did you maintain work-life boundaries today?',
      icon: 'scale',
      emojis: ["😵", "😬", "😐", "😌", "🧘"],
      value: null,
      required: true,
      metadata: {
        frequency: 'daily',
        triggers: {
          focus_areas: ['work_boundaries', 'work_life_balance']
        },
        weight: 7,
        category: 'balance',
        subcategory: 'boundaries'
      }
    },
    {
      id: 'wlb_personal_time',
      type: 'work_life_balance',
      question: 'Did you have enough time for yourself today?',
      icon: 'scale',
      emojis: ["😩", "😕", "😐", "🙂", "😌"],
      value: null,
      required: true,
      metadata: {
        frequency: 'daily',
        triggers: {
          time_conditions: ['evening']
        },
        weight: 6,
        category: 'balance',
        subcategory: 'personal_time'
      }
    },

    // Social Connection Questions
    {
      id: 'social_work_connection',
      type: 'mood',
      question: 'How connected do you feel to your team today?',
      icon: 'users',
      emojis: ["😔", "😐", "🙂", "😊", "🤗"],
      value: null,
      required: true,
      metadata: {
        frequency: 'weekly',
        triggers: {
          day_conditions: ['weekday'],
          focus_areas: ['team_collaboration', 'social_connections']
        },
        weight: 6,
        category: 'social',
        subcategory: 'workplace'
      }
    },
    {
      id: 'social_support',
      type: 'mood',
      question: 'How supported do you feel by those around you?',
      icon: 'users',
      emojis: ["😞", "😐", "🙂", "😊", "🥰"],
      value: null,
      required: true,
      metadata: {
        frequency: 'weekly',
        triggers: {
          mood_threshold: 3,
          stress_threshold: 4
        },
        weight: 7,
        category: 'social',
        subcategory: 'support'
      }
    },

    // Growth & Development Questions
    {
      id: 'growth_learning',
      type: 'mood',
      question: 'How engaged do you feel in your personal growth today?',
      icon: 'smile',
      emojis: ["😑", "😐", "🙂", "😊", "🤩"],
      value: null,
      required: true,
      metadata: {
        frequency: 'weekly',
        triggers: {
          focus_areas: ['personal_growth', 'learning'],
          day_conditions: ['weekend']
        },
        weight: 5,
        category: 'growth',
        subcategory: 'learning'
      }
    },
    {
      id: 'growth_challenges',
      type: 'mood',
      question: 'How confident do you feel tackling challenges today?',
      icon: 'smile',
      emojis: ["😰", "😐", "🙂", "😊", "💪"],
      value: null,
      required: true,
      metadata: {
        frequency: 'contextual',
        triggers: {
          stress_threshold: 3,
          focus_areas: ['confidence', 'resilience']
        },
        weight: 6,
        category: 'growth',
        subcategory: 'confidence'
      }
    },

    // Weekend/Evening Reflection Questions
    {
      id: 'reflection_week',
      type: 'mood',
      question: 'How satisfied do you feel with your week overall?',
      icon: 'smile',
      emojis: ["😞", "😐", "🙂", "😊", "🎉"],
      value: null,
      required: true,
      metadata: {
        frequency: 'weekly',
        triggers: {
          day_conditions: ['weekend'],
          time_conditions: ['evening']
        },
        weight: 7,
        category: 'reflection',
        subcategory: 'weekly'
      }
    },
    {
      id: 'reflection_gratitude',
      type: 'mood',
      question: 'How grateful are you feeling today?',
      icon: 'smile',
      emojis: ["😔", "😐", "🙂", "😊", "🙏"],
      value: null,
      required: true,
      metadata: {
        frequency: 'contextual',
        triggers: {
          time_conditions: ['evening'],
          mood_threshold: 4
        },
        weight: 5,
        category: 'reflection',
        subcategory: 'gratitude'
      }
    }
  ];

  static getQuestionsForContext(
    userId: string,
    timeOfDay: 'morning' | 'afternoon' | 'evening',
    dayType: 'weekday' | 'weekend',
    userPatterns: {
      recent_mood?: number;
      recent_stress?: number;
      recent_energy?: number;
      focus_areas?: string[];
    },
    maxQuestions: number = 5
  ): SmartQuestion[] {
    console.log('🎯 Getting contextual questions for:', {
      timeOfDay,
      dayType,
      patterns: userPatterns,
      maxQuestions
    });

    // Filter questions based on context
    const relevantQuestions = this.QUESTION_BANK.filter(question => {
      const triggers = question.metadata.triggers;
      
      // Check time conditions
      if (triggers.time_conditions && !triggers.time_conditions.includes(timeOfDay)) {
        return false;
      }
      
      // Check day conditions
      if (triggers.day_conditions && !triggers.day_conditions.includes(dayType)) {
        return false;
      }
      
      // Check stress threshold triggers
      if (triggers.stress_threshold && userPatterns.recent_stress) {
        if (userPatterns.recent_stress < triggers.stress_threshold) {
          return false;
        }
      }
      
      // Check mood threshold triggers
      if (triggers.mood_threshold && userPatterns.recent_mood) {
        if (userPatterns.recent_mood > triggers.mood_threshold) {
          return false;
        }
      }
      
      // Check focus area relevance
      if (triggers.focus_areas && userPatterns.focus_areas) {
        const hasRelevantFocus = triggers.focus_areas.some(area => 
          userPatterns.focus_areas!.includes(area)
        );
        if (!hasRelevantFocus) {
          return false;
        }
      }
      
      return true;
    });

    // Score and sort questions
    const scoredQuestions = relevantQuestions.map(question => ({
      ...question,
      contextScore: this.calculateContextScore(question, userPatterns)
    }));

    scoredQuestions.sort((a, b) => b.contextScore - a.contextScore);

    // Ensure diversity by category
    const selected: SmartQuestion[] = [];
    const usedCategories = new Set<string>();
    const maxPerCategory = Math.ceil(maxQuestions / 3);

    // First pass: select diverse categories
    for (const question of scoredQuestions) {
      if (selected.length >= maxQuestions) break;
      
      const categoryCount = selected.filter(q => 
        (q as any).metadata?.category === question.metadata.category
      ).length;
      
      if (categoryCount < maxPerCategory) {
        selected.push(this.stripMetadata(question));
        usedCategories.add(question.metadata.category);
      }
    }

    // Second pass: fill remaining slots
    for (const question of scoredQuestions) {
      if (selected.length >= maxQuestions) break;
      
      if (!selected.some(q => q.id === question.id)) {
        selected.push(this.stripMetadata(question));
      }
    }

    console.log('✅ Selected contextual questions:', {
      total: selected.length,
      categories: selected.map(q => (q as any).category || 'unknown')
    });

    return selected.slice(0, maxQuestions);
  }

  private static calculateContextScore(
    question: EnhancedSmartQuestion,
    userPatterns: any
  ): number {
    let score = question.metadata.weight;
    
    // Boost questions matching focus areas
    if (question.metadata.triggers.focus_areas && userPatterns.focus_areas) {
      const relevantFocusAreas = question.metadata.triggers.focus_areas.filter(area =>
        userPatterns.focus_areas.includes(area)
      );
      score += relevantFocusAreas.length * 2;
    }
    
    // Boost stress-related questions for high stress users
    if (question.metadata.category === 'wellness' && 
        question.type === 'stress' && 
        userPatterns.recent_stress >= 4) {
      score += 3;
    }
    
    // Boost reflection questions for evening time
    if (question.metadata.category === 'reflection' &&
        question.metadata.triggers.time_conditions?.includes('evening')) {
      score += 2;
    }
    
    return score;
  }

  private static stripMetadata(question: EnhancedSmartQuestion): SmartQuestion {
    const { metadata, ...strippedQuestion } = question;
    return strippedQuestion;
  }

  static getAllCategories(): string[] {
    const categories = new Set(this.QUESTION_BANK.map(q => q.metadata.category));
    return Array.from(categories);
  }

  static getQuestionsByCategory(category: string): SmartQuestion[] {
    return this.QUESTION_BANK
      .filter(q => q.metadata.category === category)
      .map(q => this.stripMetadata(q));
  }
}
