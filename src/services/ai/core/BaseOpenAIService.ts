
class BaseOpenAIService {
  async generateCompletion(prompt: string, systemMessage?: string, temperature: number = 0.7) {
    try {
      console.log('🔄 Generating AI completion with prompt:', prompt.substring(0, 100) + '...');
      
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke('ai-completion', {
        body: {
          prompt,
          systemMessage,
          temperature,
          model: 'gpt-4o-mini'
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw new Error(`AI completion failed: ${error.message}`);
      }

      if (!data || !data.completion) {
        console.error('❌ No completion received from AI service');
        throw new Error('No completion received from AI service');
      }

      console.log('✅ AI completion successful');
      return data.completion;
    } catch (error) {
      console.error('❌ Error generating AI completion:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('insufficient_quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your OpenAI account billing.');
      }
      if (error.message?.includes('invalid_api_key')) {
        throw new Error('Invalid OpenAI API key. Please verify your API key in Supabase settings.');
      }
      if (error.message?.includes('rate_limit_exceeded')) {
        throw new Error('OpenAI API rate limit exceeded. Please try again in a moment.');
      }
      
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('🔄 Testing OpenAI API connection...');
      
      const testCompletion = await this.generateCompletion(
        "Say 'Hello, EchoStrong! AI is working perfectly.' if you can hear me.",
        "You are a test assistant for the EchoStrong wellness platform.",
        0.1
      );
      
      console.log('✅ OpenAI API connection successful:', testCompletion);
      
      if (testCompletion.toLowerCase().includes('echostrong')) {
        return { 
          success: true, 
          message: `✅ ${testCompletion}` 
        };
      } else {
        return { 
          success: true, 
          message: `Connection working, but response was unexpected: ${testCompletion}` 
        };
      }
    } catch (error) {
      console.error('❌ OpenAI API connection failed:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export const baseOpenAIService = new BaseOpenAIService();
