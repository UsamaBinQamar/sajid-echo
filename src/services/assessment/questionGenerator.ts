
import { SmartQuestion } from "@/components/dashboard/smart-assessment/types";
import { supabase } from "@/integrations/supabase/client";

export const questionGenerator = {
  createMoodQuestions(): SmartQuestion[] {
    return [
      {
        id: 'mood',
        type: 'mood',
        question: 'How are you feeling today?',
        icon: null,
        emojis: ["😫", "😟", "😐", "😊", "😁"],
        value: null,
        required: true
      },
      {
        id: 'stress',
        type: 'stress',
        question: "What's your stress level?",
        icon: null,
        emojis: ["😌", "🙂", "😐", "😰", "🤯"],
        value: null,
        required: true
      },
      {
        id: 'energy',
        type: 'energy',
        question: "How's your energy today?",
        icon: null,
        emojis: ["😴", "😪", "😐", "⚡", "🚀"],
        value: null,
        required: true
      }
    ];
  },

  createWorkLifeBalanceQuestions(quickMode: boolean): SmartQuestion[] {
    const allQuestions = [
      {
        id: 'wlb_time',
        type: 'work_life_balance' as const,
        question: 'I have enough time to manage both work and personal responsibilities without feeling overwhelmed.',
        icon: null,
        emojis: ["😩", "😕", "😐", "🙂", "😌"],
        value: null,
        required: true
      },
      {
        id: 'wlb_energy',
        type: 'work_life_balance' as const,
        question: 'I feel mentally and physically energized during both work and personal time.',
        icon: null,
        emojis: ["😴", "😓", "😐", "😊", "⚡"],
        value: null,
        required: true
      },
      {
        id: 'wlb_boundaries',
        type: 'work_life_balance' as const,
        question: "I've been able to set and maintain healthy boundaries between work and personal life.",
        icon: null,
        emojis: ["😵", "😬", "😐", "😌", "🧘"],
        value: null,
        required: true
      }
    ];

    // In quick mode, include only 1 WLB question, otherwise all 3
    return quickMode ? allQuestions.slice(0, 1) : allQuestions;
  },

  async createFocusAreaQuestions(focusAreas: string[], quickMode: boolean): Promise<SmartQuestion[]> {
    if (!focusAreas || focusAreas.length === 0) {
      return [];
    }

    console.log('Creating focus area questions for:', focusAreas, 'Quick mode:', quickMode);

    try {
      // Limit questions in quick mode vs full mode
      const questionLimit = quickMode ? 2 : 5;
      
      const { data: questions, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .in('category', focusAreas)
        .eq('frequency_type', 'daily')
        .order('priority_level', { ascending: false })
        .limit(questionLimit);

      if (error) {
        console.error('Error fetching focus area questions:', error);
        return [];
      }

      return (questions || []).map((q, index) => ({
        id: `focus_${q.id}`,
        type: q.category as any,
        question: q.question_text,
        icon: null,
        emojis: q.emoji_options || ["😟", "😐", "🙂", "😊", "😁"],
        value: null,
        required: true
      }));
    } catch (error) {
      console.error('Error creating focus area questions:', error);
      return [];
    }
  }
};
