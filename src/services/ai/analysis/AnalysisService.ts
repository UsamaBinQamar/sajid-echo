
import { baseOpenAIService } from "../core/BaseOpenAIService";

class AnalysisService {
  async analyzeUserResponse(userMessage: string, aiResponse: string, scenarioContext: string) {
    const systemMessage = `You are an expert in leadership communication assessment. Analyze the user's response for empathy, clarity, and inclusion on a scale of 1-5.`;

    const prompt = `Analyze this leadership dialogue exchange:

USER RESPONSE: "${userMessage}"
AI CHARACTER RESPONSE: "${aiResponse}"
SCENARIO CONTEXT: ${scenarioContext}

Rate each dimension on a scale of 1-5:

EMPATHY (1-5): How well did the user demonstrate emotional understanding and validation?
- 1: Dismissive, invalidating, cold
- 5: Exceptional empathy, deep emotional attunement

CLARITY (1-5): How clear and direct was the user's communication?
- 1: Confusing, unclear, rambling
- 5: Exceptionally clear, compelling, memorable

INCLUSION (1-5): How well did the user create space for different perspectives?
- 1: Exclusionary, dismissive of differences
- 5: Exceptional inclusion, deeply affirming

Return your analysis in this JSON format:
{
  "empathy_score": X,
  "clarity_score": X, 
  "inclusion_score": X,
  "tone_analysis": {
    "primary_tone": "word",
    "confidence_level": "high/medium/low",
    "emotional_intelligence": "high/medium/low"
  }
}`;

    try {
      const response = await baseOpenAIService.generateCompletion(prompt, systemMessage, 0.3);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing response:', error);
      // Fallback scoring if JSON parsing fails
      return {
        empathy_score: 3,
        clarity_score: 3,
        inclusion_score: 3,
        tone_analysis: { 
          primary_tone: "neutral", 
          confidence_level: "medium", 
          emotional_intelligence: "medium" 
        }
      };
    }
  }

  async analyzeSentiment(text: string) {
    try {
      console.log('🔄 Analyzing sentiment for text:', text.substring(0, 50) + '...');
      
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke('ai-sentiment-analysis', {
        body: { text }
      });

      if (error) {
        console.error('❌ Sentiment analysis error:', error);
        throw new Error(`Sentiment analysis failed: ${error.message}`);
      }

      console.log('✅ Sentiment analysis successful');
      return data.analysis;
    } catch (error) {
      console.error('❌ Error analyzing sentiment:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string) {
    try {
      console.log('🔄 Generating embedding for text:', text.substring(0, 50) + '...');
      
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke('ai-embedding', {
        body: { text }
      });

      if (error) {
        console.error('❌ Embedding generation error:', error);
        throw new Error(`Embedding generation failed: ${error.message}`);
      }

      console.log('✅ Embedding generation successful');
      return data.embedding;
    } catch (error) {
      console.error('❌ Error generating embedding:', error);
      throw error;
    }
  }
}

export const analysisService = new AnalysisService();
