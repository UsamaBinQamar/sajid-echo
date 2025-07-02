
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { aiEngineService } from "@/services/ai";
import { useNavigate } from "react-router-dom";
import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";

const IntelligentPromptWidget = () => {
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadIntelligentPrompt();
  }, []);

  const loadIntelligentPrompt = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const recommendation = await aiEngineService.generatePersonalizedPrompt(session.user.id);
      setPrompt(recommendation);
    } catch (error) {
      console.error("Error loading intelligent prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const usePrompt = () => {
    if (prompt) {
      navigate(`/journal?prompt=${encodeURIComponent(prompt.content)}&title=${encodeURIComponent(prompt.title)}`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#f3c012]" />
            AI-Generated Prompt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#f3c012]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prompt) {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#f3c012]" />
            AI-Generated Prompt
          </div>
          <Badge className="bg-purple-100 text-purple-700">
            Personalized
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-2">{prompt.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{prompt.content}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-3 w-3" />
            <span>{prompt.personalizedReason}</span>
          </div>
          <span>{prompt.estimatedDuration} min</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {prompt.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button onClick={usePrompt} className="flex-1">
            Use This Prompt
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={loadIntelligentPrompt}>
            Generate New
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentPromptWidget;
