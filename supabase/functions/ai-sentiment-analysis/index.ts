
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { text } = await req.json();

    if (!text) {
      throw new Error('Text is required for sentiment analysis');
    }

    const systemMessage = `You are an expert sentiment analysis system specializing in emotional wellbeing and mental health contexts. 
    Analyze text for emotional tone, stress indicators, and overall sentiment while being sensitive to mental health concerns.
    Return your analysis as a JSON object.`;

    const prompt = `Analyze this text for sentiment and emotional indicators:
    "${text}"
    
    Return JSON with:
    - overallSentiment: very_negative|negative|neutral|positive|very_positive
    - emotionalTones: array of detected emotions
    - stressIndicators: array of stress-related phrases/themes
    - positivityScore: 0-100
    - concerningPhrases: any phrases indicating distress (if any)
    - themes: main topics/themes
    - emotionalTrend: improving|stable|declining (based on language patterns)`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse sentiment analysis response');
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-sentiment-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
