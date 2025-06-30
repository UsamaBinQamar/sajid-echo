
import { supabase } from "@/integrations/supabase/client";
import { AssessmentResponses } from "@/components/dashboard/smart-assessment/types";
import { ResponseTypeConverter } from "./responseTypeConverter";

export const dialogueRecommendationService = {
  async checkDialogueRecommendations(responses: AssessmentResponses) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('🎯 Analyzing responses for dialogue recommendations...');

      // Analyze responses to suggest relevant dialogue scenarios using centralized converter
      const stressLevel = ResponseTypeConverter.toNumber(responses['stress'] || 3);
      const moodScore = ResponseTypeConverter.toNumber(responses['mood'] || 3);
      const energyLevel = ResponseTypeConverter.toNumber(responses['energy'] || 3);

      let recommendedCategories: string[] = [];

      // High stress -> suggest boundaries/burnout scenarios
      if (stressLevel >= 4) {
        recommendedCategories.push('boundaries_burnout');
        console.log('📈 High stress detected, recommending boundaries/burnout scenarios');
      }

      // Low mood or energy -> suggest authentic leadership scenarios
      if (moodScore <= 2 || energyLevel <= 2) {
        recommendedCategories.push('authentic_leadership');
        console.log('📉 Low mood/energy detected, recommending authentic leadership scenarios');
      }

      // Work-life balance issues -> suggest power/identity scenarios
      if (responses['wlb_boundaries'] && ResponseTypeConverter.toNumber(responses['wlb_boundaries']) <= 2) {
        recommendedCategories.push('power_identity_politics');
        console.log('⚖️ Work-life balance issues detected, recommending power/identity scenarios');
      }

      if (recommendedCategories.length > 0) {
        console.log('💡 Storing dialogue recommendations:', recommendedCategories);
        
        // Store recommendation for dashboard display
        await supabase
          .from('user_dialogue_preferences')
          .upsert({
            user_id: user.id,
            focus_areas_priority: recommendedCategories,
            current_challenges: this.getChallengeSuggestions(responses),
            updated_at: new Date().toISOString()
          });
          
        console.log('✅ Dialogue recommendations saved successfully');
      }
    } catch (error) {
      console.error('❌ Error checking dialogue recommendations:', error);
    }
  },

  getChallengeSuggestions(responses: AssessmentResponses): string[] {
    const challenges: string[] = [];
    
    if (ResponseTypeConverter.toNumber(responses['stress']) >= 4) {
      challenges.push('managing_overwhelm');
    }
    
    if (ResponseTypeConverter.toNumber(responses['mood']) <= 2) {
      challenges.push('emotional_regulation');
    }
    
    if (responses['wlb_boundaries'] && ResponseTypeConverter.toNumber(responses['wlb_boundaries']) <= 2) {
      challenges.push('boundary_setting');
    }
    
    console.log('🎯 Generated challenge suggestions:', challenges);
    return challenges;
  }
};
