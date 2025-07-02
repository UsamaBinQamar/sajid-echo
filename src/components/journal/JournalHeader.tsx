
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Mic } from "lucide-react";

interface JournalHeaderProps {
  isVoiceMode: boolean;
  onModeChange: (isVoice: boolean) => void;
}

const JournalHeader = ({ isVoiceMode, onModeChange }: JournalHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center">
          <PenTool className="h-5 w-5 mr-2 text-[#f3c012]" />
          New Journal Entry
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={!isVoiceMode ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange(false)}
            className="text-white"
          >
            <PenTool className="h-4 w-4 mr-2" />
            Text
          </Button>
          <Button
            variant={isVoiceMode ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange(true)}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default JournalHeader;
