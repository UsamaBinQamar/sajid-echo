
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { smartPersonalizationService } from "@/services/personalization";
import { adaptiveAssessmentService } from "@/services/adaptiveAssessment";
import { useToast } from "@/components/ui/use-toast";

export const useAssessmentLogic = (focusAreas: string[]) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quickMode, setQuickMode] = useState(false);
  const [useAdvancedFeatures, setUseAdvancedFeatures] = useState(true);
  const { toast } = useToast();

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let selectedQuestions;
      if (quickMode) {
        selectedQuestions = await adaptiveAssessmentService.selectAdaptiveQuestions(
          session.user.id,
          focusAreas
        );
        selectedQuestions = selectedQuestions.slice(0, 1);
      } else {
        selectedQuestions = await smartPersonalizationService.selectPersonalizedQuestions(
          session.user.id,
          focusAreas,
          3,
          useAdvancedFeatures
        );
      }

      console.log('Selected questions:', selectedQuestions);
      setQuestions(selectedQuestions);
      setResponses({});
      setNotes({});
    } catch (error) {
      console.error("Error loading questions:", error);
      toast({
        title: "Error loading questions",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, score: number) => {
    setResponses(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNotesChange = (questionId: string, note: string) => {
    setNotes(prev => ({ ...prev, [questionId]: note }));
  };

  const submitResponses = async () => {
    if (Object.keys(responses).length !== questions.length) {
      toast({
        title: "Incomplete responses",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const sessionId = adaptiveAssessmentService.generateSessionId();
      const responseData = questions.map(q => ({
        question_id: q.id,
        response_score: responses[q.id],
        response_notes: notes[q.id] || null,
        assessment_session_id: sessionId
      }));

      const success = await adaptiveAssessmentService.submitResponses(
        session.user.id,
        responseData
      );

      if (success) {
        toast({
          title: "Responses submitted!",
          description: "Thank you for your reflection. Come back tomorrow for more insights.",
        });
        setQuestions([]);
        setResponses({});
        setNotes({});
      }
    } catch (error) {
      console.error("Error submitting responses:", error);
      toast({
        title: "Error submitting responses",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [focusAreas, quickMode, useAdvancedFeatures]);

  return {
    questions,
    responses,
    notes,
    isSubmitting,
    isLoading,
    quickMode,
    useAdvancedFeatures,
    setQuickMode,
    setUseAdvancedFeatures,
    handleResponseChange,
    handleNotesChange,
    submitResponses
  };
};
