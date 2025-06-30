
import { supabase } from "@/integrations/supabase/client";
import { SmartQuestion, AssessmentResponses } from "@/components/dashboard/smart-assessment/types";

// Helper function to safely convert response to number
const responseToNumber = (response: any): number => {
  if (typeof response === 'number') return response;
  if (typeof response === 'string') {
    const parsed = parseInt(response, 10);
    return isNaN(parsed) ? 3 : parsed; // Default to middle score if invalid
  }
  return 3; // Default fallback
};

export const assessmentDataService = {
  async checkDailyCompletions(userId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [moodData, wlbData] = await Promise.all([
        supabase
          .from("daily_checkins")
          .select("*")
          .eq("user_id", userId)
          .eq("date", today)
          .maybeSingle(),
        supabase
          .from("work_life_balance_assessments")
          .select("*")
          .eq("user_id", userId)
          .eq("assessment_date", today)
          .maybeSingle()
      ]);

      if (moodData.error) {
        console.error('Error checking mood data:', moodData.error);
      }
      
      if (wlbData.error) {
        console.error('Error checking WLB data:', wlbData.error);
      }

      return {
        moodCompleted: !!moodData.data,
        wlbCompleted: !!wlbData.data,
        moodData: moodData.data,
        wlbData: wlbData.data
      };
    } catch (error) {
      console.error('Error checking daily completions:', error);
      return {
        moodCompleted: false,
        wlbCompleted: false,
        moodData: null,
        wlbData: null
      };
    }
  },

  async saveMoodData(userId: string, responses: AssessmentResponses, notes: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const moodData = {
        user_id: userId,
        date: today,
        mood_score: responses['mood'] ? responseToNumber(responses['mood']) : null,
        stress_level: responses['stress'] ? responseToNumber(responses['stress']) : null,
        energy_level: responses['energy'] ? responseToNumber(responses['energy']) : null,
        notes: notes.trim() || null,
      };

      console.log('Saving individual mood data:', moodData);
      
      const result = await supabase
        .from("daily_checkins")
        .upsert(moodData, { 
          onConflict: 'user_id,date',
          ignoreDuplicates: false 
        });
        
      if (result.error) {
        console.error('Error saving mood data:', result.error);
        throw new Error(`Failed to save mood data: ${result.error.message}`);
      }
      
      console.log('Individual mood data saved successfully');
      return result;
    } catch (error) {
      console.error('Error in saveMoodData:', error);
      throw error;
    }
  },

  async saveWorkLifeBalanceData(userId: string, responses: AssessmentResponses, isQuickMode: boolean) {
    try {
      // For quick mode with only 1 question, use that score for all questions
      // For full mode, use actual responses or fallback to middle score
      const wlbTimeScore = responseToNumber(responses['wlb_time'] || responses['wlb_time'] || 3);
      const wlbEnergyScore = responseToNumber(responses['wlb_energy'] || responses['wlb_time'] || 3);
      const wlbBoundariesScore = responseToNumber(responses['wlb_boundaries'] || responses['wlb_time'] || 3);
      
      const scores = [wlbTimeScore, wlbEnergyScore, wlbBoundariesScore];
      const total = scores.reduce((acc, score) => acc + score, 0);
      const percentage = Math.round((total / 15) * 100);
      
      const getStatusCategory = (percentage: number) => {
        if (percentage >= 80) return "Thriving";
        if (percentage >= 60) return "Balanced but worth monitoring";
        if (percentage >= 40) return "Strained – consider small changes";
        return "At risk – may need active intervention or rebalancing";
      };

      const wlbData = {
        user_id: userId,
        question_1_score: scores[0],
        question_2_score: scores[1],
        question_3_score: scores[2],
        total_score: total,
        percentage: percentage,
        status_category: getStatusCategory(percentage)
      };

      console.log('Saving individual WLB data:', wlbData);

      const result = await supabase
        .from("work_life_balance_assessments")
        .insert(wlbData);
        
      if (result.error) {
        console.error('Error saving WLB data:', result.error);
        throw new Error(`Failed to save work-life balance data: ${result.error.message}`);
      }
      
      console.log('Individual WLB data saved successfully');
      return result;
    } catch (error) {
      console.error('Error in saveWorkLifeBalanceData:', error);
      throw error;
    }
  },

  async saveQuestionResponses(userId: string, responses: AssessmentResponses, questions: SmartQuestion[]) {
    try {
      console.log('Saving individual question responses:', { userId, responseCount: Object.keys(responses).length });
      
      const responsePromises = [];

      for (const question of questions) {
        const score = responses[question.id];
        if (score === undefined) continue;

        try {
          // Map question types to individual leadership categories
          const categoryMap: { [key: string]: string } = {
            'mood': 'emotional_wellbeing',
            'stress': 'stress_management',
            'energy': 'energy_management',
            'work_life_balance': 'work_life_balance',
            'communication': 'leadership_communication',
            'leadership': 'leadership_skills',
            'team_dynamics': 'interpersonal_leadership',
            'personal_growth': 'leadership_development'
          };

          const category = categoryMap[question.type] || question.type;

          // For focus area questions, extract the actual question ID
          let questionId: string;
          
          if (question.id.startsWith('focus_')) {
            // Extract the actual question ID from the focus question
            questionId = question.id.replace('focus_', '');
          } else {
            // First, ensure the assessment question exists for core questions
            let { data: existingQuestion } = await supabase
              .from('assessment_questions')
              .select('id')
              .eq('question_text', question.question)
              .eq('category', category)
              .maybeSingle();

            if (!existingQuestion) {
              // Create the assessment question for individual leadership
              const { data: newQuestion, error: questionError } = await supabase
                .from('assessment_questions')
                .insert({
                  question_text: question.question,
                  category: category,
                  emoji_options: question.emojis || ['😟', '😐', '🙂', '😊', '😁'],
                  target_focus_areas: [category],
                  frequency_type: 'daily',
                  priority_level: 1
                })
                .select('id')
                .single();

              if (questionError) {
                console.error('Error creating assessment question:', questionError);
                continue;
              }
              questionId = newQuestion.id;
            } else {
              questionId = existingQuestion.id;
            }
          }

          // Save the individual response with proper type conversion
          const responseData = {
            user_id: userId,
            question_id: questionId,
            response_score: responseToNumber(score),
            response_notes: null
          };

          console.log('Saving individual response:', responseData);

          const responsePromise = supabase
            .from('question_responses')
            .insert(responseData);

          responsePromises.push(responsePromise);
        } catch (questionError) {
          console.error('Error processing question:', question.id, questionError);
          // Continue with other questions
        }
      }

      // Execute all response saves
      const results = await Promise.allSettled(responsePromises);
      
      // Check for any errors
      const errors = results.filter(result => result.status === 'rejected');
      if (errors.length > 0) {
        console.error('Some individual question responses failed to save:', errors);
      }

      const successful = results.filter(result => result.status === 'fulfilled').length;
      console.log(`Successfully saved ${successful} out of ${responsePromises.length} individual question responses`);

    } catch (error) {
      console.error('Error saving individual question responses:', error);
      throw error;
    }
  }
};
