
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SmartQuestion, AssessmentResponses } from "./types";
import { enhancedAssessmentDataService } from "@/services/assessment/enhancedAssessmentDataService";
import { UnifiedQuestionService } from "@/services/assessment/UnifiedQuestionService";
import { AssessmentTransactionHandler } from "@/services/assessment/assessmentTransactionHandler";
import { ResponseTypeConverter } from "@/services/assessment/responseTypeConverter";

export const useSmartAssessment = (quickMode: boolean = false) => {
  const [questions, setQuestions] = useState<SmartQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
  }, [quickMode]);

  const loadQuestions = async () => {
    try {
      console.log('🔄 Loading questions with improved error handling...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('⚠️ No active session found');
        return;
      }

      // Get user's focus areas from profile with error handling
      let focusAreas: string[] = [];
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('focus_areas')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.warn('⚠️ Could not fetch user profile:', profileError);
        } else {
          focusAreas = profile?.focus_areas || [];
        }
      } catch (profileError) {
        console.warn('⚠️ Profile fetch failed:', profileError);
      }

      // Use unified question service to get dynamic questions
      const dynamicQuestions = await UnifiedQuestionService.generateQuestionsForAssessment(
        session.user.id,
        quickMode,
        focusAreas
      );

      setQuestions(dynamicQuestions);
      console.log('✅ Questions loaded successfully:', {
        count: dynamicQuestions.length,
        quickMode,
        focusAreas
      });
      
    } catch (error) {
      console.error('❌ Error loading questions:', error);
      toast({
        title: "Error loading questions",
        description: "Using fallback questions. Please refresh to try again.",
        variant: "destructive",
      });
      
      // Set minimal fallback questions
      setQuestions([
        {
          id: 'mood',
          type: 'mood',
          question: 'How would you rate your overall mood today?',
          icon: 'smile',
          emojis: ["😟", "😐", "🙂", "😊", "😁"],
          value: null,
          required: true
        }
      ]);
    }
  };

  const handleResponse = (questionId: string, value: number | string | string[]) => {
    console.log('📝 Recording response:', { questionId, value, type: typeof value });
    
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const canProceed = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    const hasResponse = responses[currentQuestion.id] !== undefined;
    return currentQuestion.required ? hasResponse : true;
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      await submitAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    console.log('🚀 Starting assessment submission...');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to save your assessment.",
          variant: "destructive",
        });
        return;
      }

      console.log('📊 Submitting assessment:', {
        userId: session.user.id,
        responses: Object.keys(responses).length,
        questions: questions.length,
        notes: notes.length
      });

      // Use the new transaction handler for improved reliability
      const submissionResult = await AssessmentTransactionHandler.submitAssessmentWithTransaction(
        session.user.id,
        responses,
        questions,
        notes
      );

      // Update assessment patterns (non-blocking)
      try {
        await enhancedAssessmentDataService.updateAssessmentPatterns(
          session.user.id,
          responses,
          questions
        );
        console.log('✅ Assessment patterns updated');
      } catch (patternError) {
        console.error('⚠️ Pattern update failed (non-critical):', patternError);
      }

      // Track usage (non-blocking)
      try {
        await enhancedAssessmentDataService.trackAssessmentCompletion(
          session.user.id,
          quickMode ? 'quick' : 'full',
          Object.keys(responses).length
        );
        console.log('✅ Usage tracked');
      } catch (trackingError) {
        console.error('⚠️ Usage tracking failed (non-critical):', trackingError);
      }

      // Handle submission results
      if (submissionResult.success) {
        setIsComplete(true);
        
        const successMessage = submissionResult.savedResponses > 0 
          ? `Assessment completed! Saved ${submissionResult.savedResponses} responses.`
          : "Assessment completed!";
          
        const description = submissionResult.failedResponses > 0
          ? `${successMessage} ${submissionResult.failedResponses} responses had issues but your main data was saved.`
          : `${successMessage} Check the Insights tab for real-time feedback.`;

        toast({
          title: "Assessment completed! ✨",
          description,
        });
      } else {
        // Partial failure
        toast({
          title: "Assessment partially saved",
          description: `Saved ${submissionResult.savedResponses} responses. Some responses failed to save - please try submitting again.`,
          variant: "destructive",
        });
      }

    } catch (error: any) {
      console.error('❌ Critical submission error:', error);
      toast({
        title: "Error saving assessment",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    currentQuestionIndex,
    responses,
    notes,
    setNotes,
    loading,
    isComplete,
    handleResponse,
    canProceed,
    handleNext,
    handlePrevious
  };
};
