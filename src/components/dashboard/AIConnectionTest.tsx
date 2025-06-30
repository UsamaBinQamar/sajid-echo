
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { openAIService } from "@/services/ai/openAIService";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

const AIConnectionTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      console.log('🔄 Testing OpenAI API connection...');
      const testResult = await openAIService.testConnection();
      console.log('✅ OpenAI test result:', testResult);
      setResult(testResult);
      
      // If successful, also test the sentiment analysis
      if (testResult.success) {
        try {
          console.log('🔄 Testing sentiment analysis...');
          const sentimentTest = await openAIService.analyzeSentiment("I'm feeling great today and excited about my progress!");
          console.log('✅ Sentiment analysis test successful:', sentimentTest);
        } catch (sentimentError) {
          console.warn('⚠️ Sentiment analysis test failed:', sentimentError);
        }
      }
    } catch (error) {
      console.error('❌ OpenAI connection test failed:', error);
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Connection Status</span>
          {result && (
            <Badge variant={result.success ? "default" : "destructive"}>
              {result.success ? "Connected" : "Error"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Test your OpenAI API connection to ensure AI features are working properly.
        </p>
        
        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test AI Connection'
          )}
        </Button>

        {result && (
          <div className={`p-3 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="font-medium">
                {result.success ? 'Connection Successful!' : 'Connection Failed'}
              </span>
            </div>
            <p className="text-sm">
              {result.success ? result.message : result.error}
            </p>
            
            {result.error && result.error.includes('invalid_api_key') && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">API Key Issue Detected</span>
                </div>
                <p className="text-xs mt-1">
                  Please check that your OpenAI API key is valid and has sufficient credits.
                </p>
              </div>
            )}
          </div>
        )}

        {result?.success && (
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">✅ Available AI Features:</p>
            <ul className="space-y-1 text-xs">
              <li>• Intelligent journal prompts</li>
              <li>• Sentiment analysis & insights</li>
              <li>• AI-powered coaching recommendations</li>
              <li>• Personalized wellness insights</li>
              <li>• Predictive analytics</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIConnectionTest;
