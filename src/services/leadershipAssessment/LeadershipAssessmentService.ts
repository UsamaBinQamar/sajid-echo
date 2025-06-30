import { supabase } from "@/integrations/supabase/client";
import { 
  LeadershipAssessmentType, 
  LeadershipAssessmentSession, 
  LeadershipAssessmentResponse,
  AssessmentInsights,
  QuestionConfig 
} from "./types";
import { ConditionalLogicEngine } from "./ConditionalLogicEngine";
import { DynamicQuestionSelector } from "./DynamicQuestionSelector";

export class LeadershipAssessmentService {
  static async getAvailableAssessmentTypes(): Promise<LeadershipAssessmentType[]> {
    try {
      const { data, error } = await supabase
        .from('leadership_assessment_types')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) {
        console.error('Error fetching assessment types:', error);
        throw error;
      }

      // Transform the data to match our TypeScript interface
      return (data || []).map(item => ({
        ...item,
        question_config: item.question_config as unknown as QuestionConfig
      }));
    } catch (error) {
      console.error('Error in getAvailableAssessmentTypes:', error);
      throw error;
    }
  }

  static async getRecommendedAssessment(userId: string): Promise<LeadershipAssessmentType | null> {
    try {
      // Get all assessment types
      const assessmentTypes = await this.getAvailableAssessmentTypes();
      
      // Get user's recent sessions to see what they've completed
      const { data: recentSessions } = await supabase
        .from('leadership_assessment_sessions')
        .select('assessment_type_id, completed_at')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('completed_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()) // Last 14 days
        .order('completed_at', { ascending: false });

      const completedTypeIds = new Set(recentSessions?.map(s => s.assessment_type_id) || []);
      
      // Filter out recently completed assessments
      const availableTypes = assessmentTypes.filter(type => !completedTypeIds.has(type.id));
      
      // Prioritize weekly assessments, then return first available
      const weeklyTypes = availableTypes.filter(type => type.frequency_type === 'weekly');
      if (weeklyTypes.length > 0) {
        return weeklyTypes[0];
      }
      
      return availableTypes.length > 0 ? availableTypes[0] : null;
    } catch (error) {
      console.error('Error getting recommended assessment:', error);
      return null;
    }
  }

  static async createDynamicAssessment(
    userId: string,
    category: string
  ): Promise<LeadershipAssessmentType | null> {
    try {
      // Get dynamic questions from the question bank
      const questions = await DynamicQuestionSelector.getQuestionsForAssessment(userId, category, 5);
      
      if (questions.length === 0) {
        console.warn(`No questions available for category: ${category}`);
        return null;
      }

      // Track question usage
      for (const question of questions) {
        await DynamicQuestionSelector.trackQuestionUsage(userId, question.key, category);
      }

      // Create a dynamic assessment type
      const dynamicAssessment: LeadershipAssessmentType = {
        id: `dynamic_${category}_${Date.now()}`,
        category: category as LeadershipAssessmentType['category'],
        title: this.getCategoryTitle(category),
        description: this.getCategoryDescription(category),
        purpose: `Personalized ${category.replace('_', ' ')} assessment with dynamic questions`,
        estimated_duration_minutes: 8,
        frequency_type: 'weekly',
        is_active: true,
        question_config: {
          questions: questions,
          reflection_prompts: ConditionalLogicEngine.generatePersonalizedPrompts(category, {})
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return dynamicAssessment;
    } catch (error) {
      console.error('Error creating dynamic assessment:', error);
      return null;
    }
  }

  private static getCategoryTitle(category: string): string {
    const titles = {
      values_alignment: 'Values in Action',
      emotional_energy: 'Emotional Energy & Sustainability',
      authenticity: 'Authentic Leadership',
      boundaries_boldness: 'Boundaries & Bold Action',
      voice_visibility: 'Voice & Visibility',
      bias_navigation: 'Bias Navigation & Inclusion'
    };
    return titles[category as keyof typeof titles] || 'Leadership Assessment';
  }

  private static getCategoryDescription(category: string): string {
    const descriptions = {
      values_alignment: 'Explore how well your actions align with your core values in challenging leadership situations.',
      emotional_energy: 'Assess your energy management, boundaries, and sustainability practices as a leader.',
      authenticity: 'Evaluate your comfort and skill in being authentic across different leadership contexts.',
      boundaries_boldness: 'Examine your ability to set boundaries and take bold action when leadership demands it.',
      voice_visibility: 'Reflect on how effectively you share your voice and make your contributions visible.',
      bias_navigation: 'Assess your awareness and skills in recognizing and addressing bias in leadership situations.'
    };
    return descriptions[category as keyof typeof descriptions] || 'A personalized leadership assessment';
  }

  static async createSession(userId: string, assessmentTypeId: string): Promise<LeadershipAssessmentSession> {
    try {
      const { data, error } = await supabase
        .from('leadership_assessment_sessions')
        .insert({
          user_id: userId,
          assessment_type_id: assessmentTypeId,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating assessment session:', error);
        throw error;
      }

      return {
        ...data,
        status: data.status as 'in_progress' | 'reflection_phase' | 'completed' | 'abandoned',
        insights_generated: data.insights_generated as unknown as AssessmentInsights | undefined
      };
    } catch (error) {
      console.error('Error in createSession:', error);
      throw error;
    }
  }

  static async saveResponse(
    sessionId: string, 
    questionKey: string, 
    responseType: string, 
    responseValue: any,
    isReflection: boolean = false
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('leadership_assessment_responses')
        .upsert({
          session_id: sessionId,
          question_key: questionKey,
          response_type: responseType,
          response_value: responseValue,
          is_reflection: isReflection
        }, {
          onConflict: 'session_id,question_key'
        });

      if (error) {
        console.error('Error saving response:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveResponse:', error);
      throw error;
    }
  }

  static async moveToReflectionPhase(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leadership_assessment_sessions')
        .update({
          status: 'reflection_phase'
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error moving to reflection phase:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in moveToReflectionPhase:', error);
      throw error;
    }
  }

  static async completeSession(sessionId: string, insights?: AssessmentInsights): Promise<void> {
    try {
      const { error } = await supabase
        .from('leadership_assessment_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          insights_generated: insights as any
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error completing session:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in completeSession:', error);
      throw error;
    }
  }

  static async getSessionResponses(sessionId: string): Promise<LeadershipAssessmentResponse[]> {
    try {
      const { data, error } = await supabase
        .from('leadership_assessment_responses')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at');

      if (error) {
        console.error('Error fetching session responses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSessionResponses:', error);
      throw error;
    }
  }

  static generateInsights(
    responses: LeadershipAssessmentResponse[], 
    assessmentType: LeadershipAssessmentType
  ): AssessmentInsights {
    const category = assessmentType.category;
    const assessmentResponses = responses.filter(r => !r.is_reflection);
    const reflectionResponses = responses.filter(r => r.is_reflection);
    
    let summary = "";
    let strengths: string[] = [];
    let growth_areas: string[] = [];
    let recommendations: string[] = [];
    let reflection_insights: string[] = [];

    // Generate insights based on assessment responses
    switch (category) {
      case 'values_alignment':
        summary = "Your values alignment shows areas of strong connection and opportunities for growth.";
        strengths = ["Clear awareness of core values", "Self-reflective leadership approach"];
        growth_areas = ["Consistency in values expression", "Integration in daily decisions"];
        recommendations = ["Schedule weekly values check-ins", "Share your values with your team"];
        break;
      
      case 'emotional_energy':
        summary = "Your energy patterns reveal important insights about your wellbeing and sustainability.";
        strengths = ["Awareness of energy sources", "Recognition of draining activities"];
        growth_areas = ["Energy management strategies", "Boundary setting for preservation"];
        recommendations = ["Create energy restoration rituals", "Audit energy-draining commitments"];
        break;
      
      case 'authenticity':
        summary = "Your authenticity journey shows courage in self-expression and areas for growth.";
        strengths = ["Self-awareness", "Courage to be genuine"];
        growth_areas = ["Consistency across contexts", "Confidence in authentic expression"];
        recommendations = ["Practice authentic communication", "Identify safe spaces for growth"];
        break;
      
      case 'boundaries_boldness':
        summary = "Your boundary-setting reveals patterns in self-advocacy and growth opportunities.";
        strengths = ["Awareness of boundaries", "Willingness to stretch"];
        growth_areas = ["Confident boundary communication", "Strategic risk-taking"];
        recommendations = ["Practice saying no with kindness", "Set stretch goals regularly"];
        break;
      
      case 'voice_visibility':
        summary = "Your voice and visibility patterns show leadership presence and influence.";
        strengths = ["Leadership awareness", "Impact recognition"];
        growth_areas = ["Consistent voice in all settings", "Strategic visibility"];
        recommendations = ["Speak up in one new setting this week", "Document your contributions"];
        break;
      
      case 'bias_navigation':
        summary = "Your bias navigation shows resilience and growth in challenging situations.";
        strengths = ["Self-awareness", "Resilience in difficult moments"];
        growth_areas = ["Proactive strategies", "Support system building"];
        recommendations = ["Develop bias interruption strategies", "Build your support network"];
        break;
    }

    // Add reflection insights if available
    if (reflectionResponses.length > 0) {
      reflection_insights = [
        "Your reflections show deep self-awareness and commitment to growth",
        "Consider revisiting these insights regularly to track your progress",
        "Your thoughtful responses indicate strong leadership potential"
      ];
    }

    return { 
      summary, 
      strengths, 
      growth_areas, 
      recommendations,
      reflection_insights 
    };
  }

  static getTriggeredReflectionPrompts(
    assessmentType: LeadershipAssessmentType,
    responses: Record<string, any>
  ) {
    return ConditionalLogicEngine.generatePersonalizedPrompts(
      assessmentType.category,
      responses
    );
  }
}
