
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { History, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";

interface AssessmentResponse {
  id: string;
  response_score: number;
  response_notes: string | null;
  created_at: string;
  assessment_session_id: string | null;
  assessment_questions: {
    category: string;
    question_text: string;
  };
}

const AssessmentHistory = () => {
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("30");
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, [timeFilter]);

  useEffect(() => {
    applyFilters();
  }, [responses, categoryFilter]);

  const loadHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeFilter));

      const { data, error } = await supabase
        .from("question_responses")
        .select(`
          id,
          response_score,
          response_notes,
          created_at,
          assessment_session_id,
          assessment_questions!inner(
            category,
            question_text
          )
        `)
        .eq("user_id", session.user.id)
        .gte("created_at", daysAgo.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      setResponses(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = responses;

    if (categoryFilter !== "all") {
      filtered = filtered.filter(response => 
        response.assessment_questions.category === categoryFilter
      );
    }

    setFilteredResponses(filtered);
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      sleep_recovery: "Sleep & Recovery",
      social_relationships: "Relationships",
      health_wellness: "Health & Wellness",
      work_boundaries: "Work Boundaries",
      personal_growth: "Personal Growth",
      financial_stress: "Financial Wellness"
    };
    return names[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      sleep_recovery: "😴",
      social_relationships: "💕",
      health_wellness: "💪",
      work_boundaries: "⚖️",
      personal_growth: "🌱",
      financial_stress: "💰"
    };
    return icons[category] || "📊";
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "bg-green-100 text-[#37654B]";
    if (score >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 4) return "😊";
    if (score >= 3) return "😐";
    return "😕";
  };

  // Group responses by session
  const sessionGroups = filteredResponses.reduce((acc: any, response) => {
    const sessionId = response.assessment_session_id || response.id;
    if (!acc[sessionId]) {
      acc[sessionId] = [];
    }
    acc[sessionId].push(response);
    return acc;
  }, {});

  // Get unique categories for filter
  const categories = [...new Set(responses.map(r => r.assessment_questions.category))];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CEA358]"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-[#CEA358]" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {getCategoryName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2 text-[#CEA358]" />
            Assessment History
          </CardTitle>
          <p className="text-sm text-gray-600">
            Showing {filteredResponses.length} responses from the last {timeFilter} days
          </p>
        </CardHeader>
        <CardContent>
          {Object.keys(sessionGroups).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(sessionGroups).map(([sessionId, sessionResponses]: [string, any]) => (
                <div key={sessionId} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {format(new Date(sessionResponses[0].created_at), "PPP")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(sessionResponses[0].created_at), "p")}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {sessionResponses.length} question{sessionResponses.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {sessionResponses.map((response: AssessmentResponse) => (
                      <div key={response.id} className="bg-white rounded-lg p-3 border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm">
                                {getCategoryIcon(response.assessment_questions.category)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryName(response.assessment_questions.category)}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium mb-2">
                              {response.assessment_questions.question_text}
                            </p>
                            {response.response_notes && (
                              <p className="text-xs text-gray-600 italic">
                                "{response.response_notes}"
                              </p>
                            )}
                          </div>
                          <Badge className={`${getScoreColor(response.response_score)} ml-4`}>
                            {getScoreEmoji(response.response_score)} {response.response_score}/5
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No assessment history found</p>
              <p className="text-sm">Complete some assessments to see your history here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentHistory;
