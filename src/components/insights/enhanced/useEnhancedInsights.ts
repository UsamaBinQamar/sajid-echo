
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { insightGenerator } from "@/services/assessment/insightGenerator";
import { smartPersonalizationService } from "@/services/personalization/smartPersonalizationService";

export const useEnhancedInsights = () => {
  const [insights, setInsights] = useState({
    immediate: [],
    patterns: [],
    trends: [],
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [daysActive, setDaysActive] = useState(0);

  useEffect(() => {
    loadEnhancedInsights();
  }, []);

  const loadEnhancedInsights = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Check user's days active to determine insight level
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const [responsesData, checkinsData] = await Promise.all([
        supabase
          .from('question_responses')
          .select('created_at')
          .eq('user_id', userId)
          .gte('created_at', thirtyDaysAgo),
        supabase
          .from('daily_checkins')
          .select('date')
          .eq('user_id', userId)
          .gte('created_at', thirtyDaysAgo)
      ]);

      const responses = responsesData.data || [];
      const checkins = checkinsData.data || [];

      const uniqueDays = new Set([
        ...checkins.map(c => c.date),
        ...responses.map(r => r.created_at.split('T')[0])
      ]).size;

      setDaysActive(uniqueDays);

      // Generate insights based on data availability
      const comprehensiveInsights = await insightGenerator.generateComprehensiveInsights(userId);
      
      // Add advanced insights for users with 15+ days
      if (uniqueDays >= 15) {
        const advancedInsights = await smartPersonalizationService.getAdvancedInsights(userId);
        comprehensiveInsights.trends.push(...advancedInsights);
      }

      setInsights(comprehensiveInsights);
    } catch (error) {
      console.error('Error loading enhanced insights:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    insights,
    loading,
    daysActive,
    reload: loadEnhancedInsights
  };
};
