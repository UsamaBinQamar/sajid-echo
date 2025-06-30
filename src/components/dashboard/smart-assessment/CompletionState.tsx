
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompletionState = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center text-[#37654B]">
          <CheckCircle className="h-6 w-6 mr-2" />
          Assessment Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="text-lg font-semibold text-[#37654B] mb-2">
            Thank you for your thoughtful responses!
          </h3>
          <p className="text-green-700 mb-6">
            Your data is being analyzed to generate personalized insights. 
            Head to the Insights tab to see real-time feedback based on your responses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate("/insights")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Live Insights
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Take Another Assessment
            </Button>
          </div>
        </div>

        <div className="bg-white/50 rounded-lg p-4 border border-green-200">
          <h4 className="font-medium text-[#37654B] mb-2 flex items-center">
            <ArrowRight className="h-4 w-4 mr-2" />
            What happens next?
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Your responses are analyzed for patterns and trends</li>
            <li>• Real-time insights appear in your Insights dashboard</li>
            <li>• Personalized recommendations are generated</li>
            <li>• Your progress is tracked over time for deeper insights</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionState;
