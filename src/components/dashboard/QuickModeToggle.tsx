
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Brain } from "lucide-react";

interface QuickModeToggleProps {
  quickMode: boolean;
  onToggle: (quickMode: boolean) => void;
}

const QuickModeToggle = ({ quickMode, onToggle }: QuickModeToggleProps) => {
  const handleModeChange = (mode: boolean) => {
    onToggle(mode);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Choose Your Assessment Mode</CardTitle>
        <p className="text-sm text-gray-600">
          Select how detailed you want today's check-in to be
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            variant={quickMode ? "default" : "outline"}
            onClick={() => handleModeChange(true)}
            className={`h-20 flex-col space-y-2 ${
              quickMode
                ? "bg-gradient-to-r from-[#f3c012] to-blue-600 hover:from-purple-700 hover:to-blue-700"
                : "hover:bg-purple-50"
            }`}
          >
            <Zap className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Quick Mode</div>
              <div className="text-xs opacity-80">1-2 focused questions</div>
            </div>
          </Button>

          <Button
            variant={!quickMode ? "default" : "outline"}
            onClick={() => handleModeChange(false)}
            className={`h-20 flex-col space-y-2 ${
              !quickMode
                ? "bg-gradient-to-r from-[#f3c012] to-blue-600 hover:from-purple-700 hover:to-blue-700"
                : "hover:bg-purple-50"
            }`}
          >
            <Brain className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Deep Dive</div>
              <div className="text-xs opacity-80">3-5 comprehensive questions</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickModeToggle;
