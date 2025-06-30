
import { openAIService } from "./openAIService";
import { supabase } from "@/integrations/supabase/client";
import { SentimentAnalysis, AIInsight } from "./types";

class SentimentAnalyzer {
  async analyzeJournalEntry(content: string, userId: string): Promise<SentimentAnalysis> {
    const systemMessage = `You are an expert in emotional intelligence and sentiment analysis.
    Analyze text for emotional tone, stress indicators, and overall sentiment.
    Be sensitive to mental health concerns while remaining objective.`;

    const prompt = `Analyze this journal entry for sentiment and emotional indicators:
    "${content}"
    
    Return JSON with:
    - overallSentiment: very_negative|negative|neutral|positive|very_positive
    - emotionalTones: array of detected emotions
    - stressIndicators: array of stress-related phrases/themes
    - positivityScore: 0-100
    - concerningPhrases: any phrases indicating distress (if any)
    - themes: main topics/themes
    - emotionalTrend: improving|stable|declining (based on language patterns)`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.3);
    const analysis = JSON.parse(response);

    // Store the analysis for pattern tracking
    await this.storeAnalysis(userId, content, analysis);

    return analysis;
  }

  async extractInsights(userId: string, timeframe: number = 7): Promise<AIInsight[]> {
    // Get recent journal entries and their sentiment data
    const { data: entries } = await supabase
      .from('journal_entries')
      .select('content, mood_score, created_at, ai_summary')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (!entries || entries.length === 0) {
      return [];
    }

    const systemMessage = `You are a wellness insights expert. Analyze patterns in journal entries
    to provide actionable insights about emotional wellbeing, stress patterns, and growth opportunities.`;

    const prompt = `Analyze these journal entries for patterns and insights:
    ${JSON.stringify(entries)}
    
    Generate 2-4 key insights as JSON array with each insight having:
    - type: emotional|behavioral|physical|social|cognitive
    - category: specific category
    - message: clear, actionable insight
    - confidence: 0-1
    - actionable: boolean
    - urgency: low|medium|high|critical
    - recommendations: array of specific actions
    - timeframe: when to act
    - evidencePoints: supporting evidence from entries`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.5);
    const insights = JSON.parse(response);

    return insights.map((insight: any) => ({
      ...insight,
      id: `insight_${Date.now()}_${Math.random()}`,
      createdAt: new Date()
    }));
  }

  private async storeAnalysis(userId: string, content: string, analysis: SentimentAnalysis) {
    try {
      // Store in a sentiment_analysis table (we'd need to create this)
      console.log('Sentiment analysis completed:', analysis);
      // For now, we'll just log it. In a real implementation, we'd store this data
    } catch (error) {
      console.error('Error storing sentiment analysis:', error);
    }
  }

  async detectCrisisIndicators(content: string): Promise<boolean> {
    const systemMessage = `You are a mental health crisis detection system.
    Identify if text contains indicators of immediate mental health crisis or self-harm risk.
    Be highly sensitive but avoid false positives.`;

    const prompt = `Analyze this text for crisis indicators:
    "${content}"
    
    Return JSON with:
    - crisisDetected: boolean
    - riskLevel: none|low|medium|high|critical
    - indicators: array of concerning phrases
    - recommendedAction: immediate|24hour|routine|none`;

    const response = await openAIService.generateCompletion(prompt, systemMessage, 0.1);
    const analysis = JSON.parse(response);

    if (analysis.crisisDetected && analysis.riskLevel === 'critical') {
      // In a real implementation, this would trigger immediate intervention protocols
      console.warn('Crisis indicators detected - intervention protocols should be activated');
    }

    return analysis.crisisDetected;
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();
