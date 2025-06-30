
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, RotateCcw, X, User, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DialogueSession {
  id: string;
  scenario_id: string;
  status: string;
}

interface ActiveDialogueProps {
  session: DialogueSession;
  onComplete: () => void;
  onExit: () => void;
}

interface DialogueExchange {
  id: string;
  exchange_number: number;
  user_response: string;
  ai_response: string;
  empathy_score?: number;
  clarity_score?: number;
  inclusion_score?: number;
}

interface ScenarioData {
  title: string;
  character_persona: any;
  initial_situation: string;
  scenario_setup: string;
}

const ActiveDialogue: React.FC<ActiveDialogueProps> = ({ session, onComplete, onExit }) => {
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [exchanges, setExchanges] = useState<DialogueExchange[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchScenarioData();
  }, [session]);

  const fetchScenarioData = async () => {
    try {
      const { data, error } = await supabase
        .from('dialogue_scenarios')
        .select('*')
        .eq('id', session.scenario_id)
        .single();

      if (error) throw error;
      setScenario(data);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      toast({
        title: "Error",
        description: "Failed to load scenario data.",
        variant: "destructive",
      });
    }
  };

  const sendResponse = async () => {
    if (!currentResponse.trim() || !scenario) return;

    setIsLoading(true);
    try {
      // Call AI service to generate response and scoring
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-completion', {
        body: {
          messages: [
            {
              role: 'system',
              content: `You are ${scenario.character_persona.name}, ${scenario.character_persona.role}. 
                       Personality: ${scenario.character_persona.personality}
                       Current emotional state: ${scenario.character_persona.emotional_state}
                       Background: ${scenario.character_persona.background}
                       
                       Respond realistically to the user's leadership communication. Show emotional reactions based on their tone and approach. Rate their response on empathy (1-5), clarity (1-5), and inclusion (1-5).
                       
                       Return JSON with: { "response": "your character response", "empathy_score": number, "clarity_score": number, "inclusion_score": number, "emotional_state": "current emotional state" }`
            },
            {
              role: 'user',
              content: currentResponse
            }
          ]
        }
      });

      if (aiError) throw aiError;

      const aiData = JSON.parse(aiResponse.response);
      
      // Save exchange to database
      const { data: exchange, error: exchangeError } = await supabase
        .from('dialogue_exchanges')
        .insert({
          session_id: session.id,
          exchange_number: exchangeCount + 1,
          user_response: currentResponse,
          ai_response: aiData.response,
          empathy_score: aiData.empathy_score,
          clarity_score: aiData.clarity_score,
          inclusion_score: aiData.inclusion_score,
          ai_emotional_state: { state: aiData.emotional_state }
        })
        .select()
        .single();

      if (exchangeError) throw exchangeError;

      setExchanges([...exchanges, exchange]);
      setExchangeCount(exchangeCount + 1);
      setCurrentResponse('');

      // Check if dialogue should end (after 5 exchanges or user chooses to end)
      if (exchangeCount >= 4) {
        await completeDialogue();
      }

    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const completeDialogue = async () => {
    try {
      // Calculate overall scores
      const empathyScores = exchanges.map(e => e.empathy_score || 0);
      const clarityScores = exchanges.map(e => e.clarity_score || 0);
      const inclusionScores = exchanges.map(e => e.inclusion_score || 0);

      const avgEmpathy = empathyScores.reduce((a, b) => a + b, 0) / empathyScores.length;
      const avgClarity = clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length;
      const avgInclusion = inclusionScores.reduce((a, b) => a + b, 0) / inclusionScores.length;

      // Generate assessment
      const { data: assessment, error: assessmentError } = await supabase
        .from('dialogue_assessments')
        .insert({
          session_id: session.id,
          overall_empathy_score: avgEmpathy,
          overall_clarity_score: avgClarity,
          overall_inclusion_score: avgInclusion,
          strengths: generateStrengths(avgEmpathy, avgClarity, avgInclusion),
          improvement_areas: generateImprovementAreas(avgEmpathy, avgClarity, avgInclusion),
          journal_prompt: "Reflect on this conversation: What did you learn about your leadership communication style? How might you approach similar situations in the future?"
        });

      if (assessmentError) throw assessmentError;

      // Update session status
      await supabase
        .from('dialogue_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          final_scores: {
            empathy: avgEmpathy,
            clarity: avgClarity,
            inclusion: avgInclusion
          }
        })
        .eq('id', session.id);

      onComplete();
    } catch (error) {
      console.error('Error completing dialogue:', error);
      toast({
        title: "Error",
        description: "Failed to complete dialogue assessment.",
        variant: "destructive",
      });
    }
  };

  const generateStrengths = (empathy: number, clarity: number, inclusion: number) => {
    const strengths = [];
    if (empathy >= 4) strengths.push("Strong empathetic communication");
    if (clarity >= 4) strengths.push("Clear and direct messaging");
    if (inclusion >= 4) strengths.push("Inclusive and considerate approach");
    if (strengths.length === 0) strengths.push("Willingness to engage in difficult conversations");
    return strengths;
  };

  const generateImprovementAreas = (empathy: number, clarity: number, inclusion: number) => {
    const areas = [];
    if (empathy < 3) areas.push("Developing empathetic listening and response");
    if (clarity < 3) areas.push("Improving message clarity and structure");
    if (inclusion < 3) areas.push("Enhancing inclusive communication practices");
    return areas;
  };

  if (!scenario) return <div>Loading scenario...</div>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-[#CEA358]" />
              {scenario.title}
            </CardTitle>
            <div className="flex space-x-2">
              <Badge variant="outline">Exchange {exchangeCount + 1}/5</Badge>
              <Button variant="ghost" size="sm" onClick={onExit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Scenario Setup</h3>
            <p className="text-sm text-gray-700">{scenario.scenario_setup}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-blue-900">{scenario.character_persona.name}</div>
                <p className="text-blue-800">{scenario.initial_situation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation History */}
      <div className="space-y-4 mb-6">
        {exchanges.map((exchange, index) => (
          <div key={exchange.id} className="space-y-3">
            {/* User Response */}
            <div className="flex justify-end">
              <div className="max-w-3xl">
                <div className="bg-purple-100 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div>
                      <div className="font-semibold text-purple-900 mb-1">You</div>
                      <p className="text-purple-800">{exchange.user_response}</p>
                    </div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-3 text-xs">
                    <Badge variant="secondary">Empathy: {exchange.empathy_score}/5</Badge>
                    <Badge variant="secondary">Clarity: {exchange.clarity_score}/5</Badge>
                    <Badge variant="secondary">Inclusion: {exchange.inclusion_score}/5</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex justify-start">
              <div className="max-w-3xl">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-blue-900 mb-1">{scenario.character_persona.name}</div>
                      <p className="text-blue-800">{exchange.ai_response}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Response Input */}
      {exchangeCount < 5 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                placeholder="Type your response..."
                className="min-h-24"
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? 'Stop' : 'Record'}
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setCurrentResponse('')}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button 
                    onClick={sendResponse} 
                    disabled={!currentResponse.trim() || isLoading}
                    className="bg-[#CEA358] hover:bg-purple-700"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {isLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {exchangeCount >= 5 && (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Dialogue Complete!</h3>
            <p className="text-gray-600 mb-4">You've completed this leadership conversation scenario.</p>
            <Button onClick={completeDialogue} className="bg-[#CEA358] hover:bg-purple-700">
              View Results & Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveDialogue;
