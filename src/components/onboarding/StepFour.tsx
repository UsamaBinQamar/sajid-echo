
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface StepFourProps {
  reflection: string;
  setReflection: (reflection: string) => void;
  loading: boolean;
  onComplete: () => void;
  onBack: () => void;
}

const StepFour = ({ reflection, setReflection, loading, onComplete, onBack }: StepFourProps) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">What Brings You Here?</CardTitle>
        <p className="text-gray-600">Share what's on your heart (optional)</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What hopes, challenges, or goals brought you to EchoStrong today?"
          className="min-h-32"
        />
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button 
            onClick={onComplete}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start My Journey <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepFour;
