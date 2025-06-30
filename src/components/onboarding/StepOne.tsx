
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface StepOneProps {
  pronouns: string;
  setPronouns: (pronouns: string) => void;
  preferredName: string;
  setPreferredName: (name: string) => void;
  onNext: () => void;
}

const StepOne = ({ pronouns, setPronouns, preferredName, setPreferredName, onNext }: StepOneProps) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-to-r from-[#CEA358] to-blue-600 bg-clip-text text-transparent">
          Welcome to Your Journey
        </CardTitle>
        <p className="text-gray-600">Let's personalize your EchoStrong experience</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="preferred-name">What would you like us to call you?</Label>
          <Input
            id="preferred-name"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            placeholder="Your preferred name"
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">This helps us make the experience feel more personal</p>
        </div>
        
        <div>
          <Label htmlFor="pronouns">Pronouns (Optional)</Label>
          <Input
            id="pronouns"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="she/her, he/him, they/them, etc."
            className="mt-2"
          />
        </div>
        
        <div className="text-center">
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-[#CEA358] to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepOne;
