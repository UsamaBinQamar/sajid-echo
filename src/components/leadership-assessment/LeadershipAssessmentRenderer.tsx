
import React, { useState, useEffect } from 'react';
import { LeadershipAssessmentType, LeadershipAssessmentSession, ReflectionPrompt } from "@/services/leadershipAssessment/types";
import { LeadershipAssessmentService } from "@/services/leadershipAssessment/LeadershipAssessmentService";
import { DynamicQuestionSelector } from "@/services/leadershipAssessment/DynamicQuestionSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import BatchAssessmentRenderer from './BatchAssessmentRenderer';
import ReflectionPromptRenderer from './ReflectionPromptRenderer';

interface LeadershipAssessmentRendererProps {
  assessmentType: LeadershipAssessmentType;
  onComplete: () => void;
  onBack: () => void;
}

const LeadershipAssessmentRenderer: React.FC<LeadershipAssessmentRendererProps> = ({
  assessmentType,
  onComplete,
  onBack
}) => {
  const [phase, setPhase] = useState<'assessment' | 'reflection'>('assessment');
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [reflectionResponses, setReflectionResponses] = useState<Record<string, any>>({});
  const [session, setSession] = useState<LeadershipAssessmentSession | null>(null);
  const [reflectionPrompts, setReflectionPrompts] = useState<ReflectionPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const questions = assessmentType.question_config.questions;

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newSession = await LeadershipAssessmentService.createSession(user.id, assessmentType.id);
      setSession(newSession);
    } catch (error) {
      console.error('Error initializing session:', error);
      toast({
        title: "Error",
        description: "Failed to start assessment session.",
        variant: "destructive",
      });
    }
  };

  const handleAssessmentResponse = async (questionKey: string, value: any) => {
    if (!session) return;

    const newResponses = { ...responses, [questionKey]: value };
    setResponses(newResponses);

    try {
      const question = questions.find(q => q.key === questionKey);
      await LeadershipAssessmentService.saveResponse(
        session.id,
        questionKey,
        question?.type || 'unknown',
        value,
        false
      );

      // Track question usage and update score for dynamic questions
      const { data: { user } } = await supabase.auth.getUser();
      if (user && question) {
        // Calculate a score based on the response value
        let score: number | undefined;
        if (typeof value === 'number') {
          score = value;
        } else if (Array.isArray(value)) {
          score = value.length > 0 ? 3 : 1; // Basic scoring for array responses
        } else if (typeof value === 'string') {
          score = 3; // Neutral score for text responses
        }

        if (score !== undefined) {
          await DynamicQuestionSelector.updateQuestionScore(user.id, questionKey, score);
        }
      }
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const handleAssessmentSubmit = async () => {
    if (!session) return;

    setLoading(true);
    try {
      // Move to reflection phase
      await LeadershipAssessmentService.moveToReflectionPhase(session.id);
      
      // Get triggered reflection prompts
      const prompts = LeadershipAssessmentService.getTriggeredReflectionPrompts(
        assessmentType,
        responses
      );
      
      setReflectionPrompts(prompts);
      setPhase('reflection');
      
      toast({
        title: "Assessment Complete! 🎉",
        description: "Now let's reflect on your responses for deeper insights.",
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to submit assessment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReflectionResponse = async (promptKey: string, value: any) => {
    if (!session) return;

    const newReflectionResponses = { ...reflectionResponses, [promptKey]: value };
    setReflectionResponses(newReflectionResponses);

    try {
      await LeadershipAssessmentService.saveResponse(
        session.id,
        promptKey,
        'text',
        value,
        true
      );
    } catch (error) {
      console.error('Error saving reflection response:', error);
    }
  };

  const handleReflectionComplete = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const sessionResponses = await LeadershipAssessmentService.getSessionResponses(session.id);
      const insights = LeadershipAssessmentService.generateInsights(sessionResponses, assessmentType);
      
      await LeadershipAssessmentService.completeSession(session.id, insights);
      
      toast({
        title: "Reflection Complete! ✨",
        description: `Your ${assessmentType.title} insights are ready.`,
      });
      
      onComplete();
    } catch (error) {
      console.error('Error completing reflection:', error);
      toast({
        title: "Error",
        description: "Failed to complete reflection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (phase === 'assessment') {
    return (
      <BatchAssessmentRenderer
        questions={questions}
        title={assessmentType.title}
        description={assessmentType.description}
        category={assessmentType.category}
        responses={responses}
        onResponseChange={handleAssessmentResponse}
        onSubmit={handleAssessmentSubmit}
        onBack={onBack}
        loading={loading}
      />
    );
  }

  return (
    <ReflectionPromptRenderer
      prompts={reflectionPrompts}
      title={assessmentType.title}
      category={assessmentType.category}
      responses={reflectionResponses}
      onResponseChange={handleReflectionResponse}
      onComplete={handleReflectionComplete}
      loading={loading}
    />
  );
};

export default LeadershipAssessmentRenderer;
