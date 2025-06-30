
import { supabase } from "@/integrations/supabase/client";
import { LeadershipQuestionBankItem, UserLeadershipQuestionHistory, AssessmentQuestion } from "./types";

export class DynamicQuestionSelector {
  static async getQuestionsForAssessment(
    userId: string,
    category: string,
    targetQuestionCount: number = 5
  ): Promise<AssessmentQuestion[]> {
    try {
      // Get available questions from the bank for this category
      const { data: bankQuestions, error: bankError } = await supabase
        .from('leadership_question_bank')
        .select('*')
        .eq('category', category)
        .order('frequency_weight', { ascending: false });

      if (bankError) throw bankError;

      // Get user's question history for this category
      const { data: userHistory, error: historyError } = await supabase
        .from('user_leadership_question_history')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category);

      if (historyError) throw historyError;

      // Create a map of question history for quick lookup
      const historyMap = new Map<string, UserLeadershipQuestionHistory>();
      userHistory?.forEach(h => historyMap.set(h.question_key, h));

      // Cast the database results to our expected type
      const typedBankQuestions: LeadershipQuestionBankItem[] = (bankQuestions || []).map(q => ({
        ...q,
        question_type: q.question_type as 'multiple_choice' | 'slider' | 'ranking' | 'action_commitment',
        question_config: q.question_config as {
          options?: string[];
          multiple_select?: boolean;
          min?: number;
          max?: number;
          emojis?: string[];
          type?: string;
          commitment_type?: string;
        }
      }));

      // Score and select questions
      const scoredQuestions = this.scoreQuestions(typedBankQuestions, historyMap);
      
      // Select diverse question types
      const selectedQuestions = this.selectDiverseQuestions(scoredQuestions, targetQuestionCount);

      // Convert to AssessmentQuestion format
      return selectedQuestions.map(q => this.convertToAssessmentQuestion(q));
    } catch (error) {
      console.error('Error selecting questions:', error);
      return [];
    }
  }

  private static scoreQuestions(
    bankQuestions: LeadershipQuestionBankItem[],
    historyMap: Map<string, UserLeadershipQuestionHistory>
  ): Array<{ question: LeadershipQuestionBankItem; score: number }> {
    return bankQuestions.map(question => {
      let score = question.frequency_weight;
      
      const history = historyMap.get(question.question_key);
      if (history) {
        // Reduce score based on how recently it was asked
        const daysSinceAsked = Math.floor(
          (Date.now() - new Date(history.last_asked_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // Prefer questions not asked recently
        if (daysSinceAsked < 7) score *= 0.1;
        else if (daysSinceAsked < 14) score *= 0.5;
        else if (daysSinceAsked < 30) score *= 0.8;
        
        // Reduce score based on how many times asked
        score *= Math.max(0.2, 1 - (history.times_asked * 0.1));
      } else {
        // Boost score for never-asked questions
        score *= 1.5;
      }

      return { question, score };
    });
  }

  private static selectDiverseQuestions(
    scoredQuestions: Array<{ question: LeadershipQuestionBankItem; score: number }>,
    targetCount: number
  ): LeadershipQuestionBankItem[] {
    // Sort by score descending
    scoredQuestions.sort((a, b) => b.score - a.score);

    const selected: LeadershipQuestionBankItem[] = [];
    const typeCount = new Map<string, number>();

    // Try to get diverse question types
    for (const { question } of scoredQuestions) {
      if (selected.length >= targetCount) break;

      const currentTypeCount = typeCount.get(question.question_type) || 0;
      
      // Limit each type to prevent over-representation
      if (currentTypeCount < Math.ceil(targetCount / 2)) {
        selected.push(question);
        typeCount.set(question.question_type, currentTypeCount + 1);
      }
    }

    // Fill remaining slots if needed
    for (const { question } of scoredQuestions) {
      if (selected.length >= targetCount) break;
      if (!selected.includes(question)) {
        selected.push(question);
      }
    }

    return selected.slice(0, targetCount);
  }

  private static convertToAssessmentQuestion(bankQuestion: LeadershipQuestionBankItem): AssessmentQuestion {
    const baseQuestion: AssessmentQuestion = {
      key: bankQuestion.question_key,
      type: bankQuestion.question_type as AssessmentQuestion['type'],
      text: bankQuestion.question_text,
      question_config: bankQuestion.question_config
    };

    // Add type-specific properties based on question_config
    const config = bankQuestion.question_config;
    
    if (config.options) baseQuestion.options = config.options;
    if (config.multiple_select !== undefined) baseQuestion.multiple_select = config.multiple_select;
    if (config.min !== undefined) baseQuestion.min = config.min;
    if (config.max !== undefined) baseQuestion.max = config.max;
    if (config.emojis) baseQuestion.emojis = config.emojis;

    return baseQuestion;
  }

  static async trackQuestionUsage(
    userId: string,
    questionKey: string,
    category: string,
    responseScore?: number
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_leadership_question_history')
        .upsert({
          user_id: userId,
          question_key: questionKey,
          category: category,
          last_asked_at: new Date().toISOString(),
          times_asked: 1,
          avg_response_score: responseScore || null
        }, {
          onConflict: 'user_id,question_key',
          ignoreDuplicates: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking question usage:', error);
    }
  }

  static async updateQuestionScore(
    userId: string,
    questionKey: string,
    newScore: number
  ): Promise<void> {
    try {
      // Get current history
      const { data: history, error: fetchError } = await supabase
        .from('user_leadership_question_history')
        .select('avg_response_score, times_asked')
        .eq('user_id', userId)
        .eq('question_key', questionKey)
        .single();

      if (fetchError) throw fetchError;

      if (history) {
        // Calculate new average
        const currentAvg = history.avg_response_score || 0;
        const timesAsked = history.times_asked;
        const newAvg = ((currentAvg * (timesAsked - 1)) + newScore) / timesAsked;

        const { error: updateError } = await supabase
          .from('user_leadership_question_history')
          .update({
            avg_response_score: Number(newAvg.toFixed(2)),
            last_asked_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('question_key', questionKey);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error updating question score:', error);
    }
  }
}
