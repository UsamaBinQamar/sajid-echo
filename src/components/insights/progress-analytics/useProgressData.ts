
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CategoryData {
  category: string;
  avg_score: number;
  trend_direction: string;
  question_frequency: number;
  last_low_score_date: string | null;
}

interface TrendData {
  date: string;
  score: number;
  category: string;
}

export const useProgressData = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadAnalyticsData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Load category patterns
      const { data: patterns } = await supabase
        .from("assessment_patterns")
        .select("*")
        .eq("user_id", session.user.id);

      setCategoryData(patterns || []);

      // Load trend data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: responses } = await supabase
        .from("question_responses")
        .select(`
          response_score,
          created_at,
          assessment_questions(category)
        `)
        .eq("user_id", session.user.id)
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Process trend data
      const processedTrends: TrendData[] = [];
      responses?.forEach((response: any) => {
        const date = new Date(response.created_at).toLocaleDateString();
        processedTrends.push({
          date,
          score: response.response_score,
          category: response.assessment_questions?.category || "Unknown"
        });
      });

      setTrendData(processedTrends);

    } catch (error: any) {
      toast({
        title: "Error loading analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  return {
    categoryData,
    trendData,
    loading,
    reload: loadAnalyticsData
  };
};
