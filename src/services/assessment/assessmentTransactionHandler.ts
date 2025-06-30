import { supabase } from "@/integrations/supabase/client";
import { SmartQuestion, AssessmentResponses } from "@/components/dashboard/smart-assessment/types";
import { ResponseTypeConverter } from "./responseTypeConverter";

export interface AssessmentSubmissionResult {
  success: boolean;
  errors: string[];
  savedResponses: number;
  failedResponses: number;
}

export class AssessmentTransactionHandler {
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY_MS = 1000;

  static async submitAssessmentWithTransaction(
    userId: string,
    responses: AssessmentResponses,
    questions: SmartQuestion[],
    notes: string = ""
  ): Promise<AssessmentSubmissionResult> {
    console.log('🔄 Starting assessment submission transaction for user:', userId);
    
    const submissionResult: AssessmentSubmissionResult = {
      success: false,
      errors: [],
      savedResponses: 0,
      failedResponses: 0
    };

    try {
      // Validate inputs
      if (!userId || !responses || !questions) {
        throw new Error('Invalid submission parameters');
      }

      // Process responses with transaction-like behavior
      const submissionPromises = questions.map(async (question) => {
        const responseValue = responses[question.id];
        if (responseValue === undefined) {
          console.log(`⏭️ Skipping question ${question.id} - no response provided`);
          return { success: true, questionId: question.id, skipped: true };
        }

        return await this.submitSingleResponseWithRetry(
          userId,
          question,
          responseValue,
          notes
        );
      });

      // Execute all submissions
      const submissionResults = await Promise.allSettled(submissionPromises);
      
      // Process results correctly - fix the variable reference bug
      submissionResults.forEach((settledResult, index) => {
        const questionId = questions[index].id;
        
        if (settledResult.status === 'fulfilled') {
          const response = settledResult.value;
          if (response.success && !response.skipped) {
            submissionResult.savedResponses++;
          } else if (response.error && !response.skipped) {
            submissionResult.errors.push(`Question ${questionId}: ${response.error}`);
            submissionResult.failedResponses++;
          }
        } else {
          submissionResult.errors.push(`Question ${questionId}: ${settledResult.reason}`);
          submissionResult.failedResponses++;
        }
      });

      // Submit daily checkin summary
      try {
        await this.saveDailyCheckinSummary(userId, responses, notes);
        console.log('✅ Daily checkin summary saved');
      } catch (summaryError) {
        console.error('⚠️ Failed to save daily checkin summary:', summaryError);
        submissionResult.errors.push(`Daily summary: ${summaryError}`);
      }

      // Determine overall success
      submissionResult.success = submissionResult.errors.length === 0 || 
        (submissionResult.savedResponses > 0 && submissionResult.savedResponses >= submissionResult.failedResponses);

      console.log('📊 Assessment submission completed:', {
        success: submissionResult.success,
        saved: submissionResult.savedResponses,
        failed: submissionResult.failedResponses,
        errors: submissionResult.errors.length
      });

      return submissionResult;

    } catch (error) {
      console.error('❌ Critical error in assessment submission:', error);
      submissionResult.errors.push(`Transaction error: ${error}`);
      return submissionResult;
    }
  }

  private static async submitSingleResponseWithRetry(
    userId: string,
    question: SmartQuestion,
    responseValue: any,
    notes: string,
    attempt: number = 1
  ): Promise<{ success: boolean; questionId: string; error?: string; skipped?: boolean }> {
    try {
      // Validate and convert response
      const expectedType = ResponseTypeConverter.getExpectedResponseType(question);
      const validation = ResponseTypeConverter.validateAndConvert(
        responseValue,
        expectedType,
        question.id
      );

      if (!validation.isValid) {
        return {
          success: false,
          questionId: question.id,
          error: validation.error || 'Invalid response format'
        };
      }

      // Handle different question types
      if (['mood', 'stress', 'energy'].includes(question.type)) {
        await this.saveWellnessResponse(userId, question, validation.convertedValue);
      } else if (['multiple_choice', 'ranking', 'action_commitment', 'slider'].includes(question.type)) {
        await this.saveLeadershipResponse(userId, question, validation.convertedValue);
      } else if (question.type === 'work_life_balance') {
        await this.saveWorkLifeBalanceResponse(userId, question, validation.convertedValue);
      } else {
        // Default to wellness response
        await this.saveWellnessResponse(userId, question, validation.convertedValue);
      }

      return { success: true, questionId: question.id };

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed for question ${question.id}:`, error);

      if (attempt < this.MAX_RETRY_ATTEMPTS) {
        console.log(`🔄 Retrying question ${question.id} (attempt ${attempt + 1})`);
        await this.delay(this.RETRY_DELAY_MS * attempt);
        return this.submitSingleResponseWithRetry(userId, question, responseValue, notes, attempt + 1);
      }

      return {
        success: false,
        questionId: question.id,
        error: `Failed after ${this.MAX_RETRY_ATTEMPTS} attempts: ${error}`
      };
    }
  }

  private static async saveWellnessResponse(
    userId: string,
    question: SmartQuestion,
    responseValue: any
  ): Promise<void> {
    // Find or create assessment question
    let { data: existingQuestion } = await supabase
      .from('assessment_questions')
      .select('id')
      .eq('category', question.type)
      .limit(1);

    let assessmentQuestionId = existingQuestion?.[0]?.id;

    if (!assessmentQuestionId) {
      const { data: newQuestion, error: questionError } = await supabase
        .from('assessment_questions')
        .insert({
          category: question.type,
          question_text: question.question,
          emoji_options: question.emojis,
          priority_level: 1
        })
        .select()
        .single();

      if (questionError) throw questionError;
      assessmentQuestionId = newQuestion.id;
    }

    // Save to question_responses
    const { error: responseError } = await supabase
      .from('question_responses')
      .insert({
        user_id: userId,
        question_id: assessmentQuestionId,
        response_score: ResponseTypeConverter.toNumber(responseValue),
        response_notes: typeof responseValue === 'string' ? responseValue : null
      });

    if (responseError) throw responseError;
  }

  private static async saveLeadershipResponse(
    userId: string,
    question: SmartQuestion,
    responseValue: any
  ): Promise<void> {
    // Save to question_responses for analytics
    await this.saveWellnessResponse(userId, question, responseValue);
  }

  private static async saveWorkLifeBalanceResponse(
    userId: string,
    question: SmartQuestion,
    responseValue: any
  ): Promise<void> {
    await this.saveWellnessResponse(userId, question, responseValue);
  }

  private static async saveDailyCheckinSummary(
    userId: string,
    responses: AssessmentResponses,
    notes: string
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const moodScore = responses['mood'] ? ResponseTypeConverter.toNumber(responses['mood']) : null;
    const stressLevel = responses['stress'] ? ResponseTypeConverter.toNumber(responses['stress']) : null;
    const energyLevel = responses['energy'] ? ResponseTypeConverter.toNumber(responses['energy']) : null;
    
    const checkinData = {
      user_id: userId,
      date: today,
      mood_score: moodScore,
      stress_level: stressLevel,
      energy_level: energyLevel,
      notes: notes || null
    };

    const { error: checkinError } = await supabase
      .from('daily_checkins')
      .upsert(checkinData, {
        onConflict: 'user_id,date'
      });

    if (checkinError) {
      throw new Error(`Daily checkin save failed: ${checkinError.message}`);
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
