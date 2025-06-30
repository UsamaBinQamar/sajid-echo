
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { LEADERSHIP_ROLES } from "./constants";

interface StepTwoProps {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepTwo = ({ selectedRole, setSelectedRole, onNext, onBack }: StepTwoProps) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Choose Your Leadership Identity</CardTitle>
        <p className="text-gray-600">How do you see yourself as a leader?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {LEADERSHIP_ROLES.map((role) => (
            <Button
              key={role}
              variant={selectedRole === role ? "default" : "outline"}
              onClick={() => setSelectedRole(role)}
              className={selectedRole === role ? "bg-gradient-to-r from-[#CEA358] to-blue-600" : ""}
            >
              {role}
            </Button>
          ))}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedRole}
            className="bg-gradient-to-r from-[#CEA358] to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepTwo;
