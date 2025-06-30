
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { FOCUS_AREAS } from "./constants";

interface StepThreeProps {
  selectedFocusAreas: string[];
  toggleFocusArea: (area: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepThree = ({ selectedFocusAreas, toggleFocusArea, onNext, onBack }: StepThreeProps) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Set Your Focus Areas</CardTitle>
        <p className="text-gray-600">Choose 1-3 areas you'd like to develop (selected: {selectedFocusAreas.length}/3)</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FOCUS_AREAS.map((area) => (
            <Badge
              key={area}
              variant={selectedFocusAreas.includes(area) ? "default" : "outline"}
              className={`cursor-pointer p-3 text-center justify-center ${
                selectedFocusAreas.includes(area) 
                  ? "bg-gradient-to-r from-[#CEA358] to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleFocusArea(area)}
            >
              {area}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button 
            onClick={onNext}
            disabled={selectedFocusAreas.length === 0}
            className="bg-gradient-to-r from-[#CEA358] to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepThree;
