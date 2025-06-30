
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  hasPermission: boolean | null;
  onToggleRecording: () => void;
  recordingTime?: string;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isRecording,
  isProcessing,
  hasPermission,
  onToggleRecording,
  recordingTime
}) => {
  const getButtonContent = () => {
    if (isProcessing) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    
    if (isRecording) {
      return (
        <div className="flex items-center gap-2">
          <MicOff className="h-4 w-4" />
          {recordingTime && (
            <span 
              className="text-xs"
              aria-label={`Recording time: ${recordingTime}`}
            >
              {recordingTime}
            </span>
          )}
        </div>
      );
    }
    
    return <Mic className="h-4 w-4" />;
  };

  const getButtonText = () => {
    if (isProcessing) return "Processing voice input";
    if (isRecording) return "Stop recording";
    return "Start voice input";
  };

  const getAriaDescription = () => {
    if (hasPermission === false) {
      return "Microphone permission required for voice input";
    }
    if (isProcessing) {
      return "Processing your voice input, please wait";
    }
    if (isRecording) {
      return `Currently recording. Recording time: ${recordingTime || '0:00'}. Press to stop recording.`;
    }
    return "Press to start voice recording as an alternative to typing your response";
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggleRecording}
      disabled={isProcessing || hasPermission === false}
      className={`${
        isRecording 
          ? "bg-red-50 border-red-200 text-[#8A1503] hover:bg-red-100 focus-visible:ring-[#8A1503]" 
          : "hover:bg-gray-50 focus-visible:ring-primary"
      } transition-colors`}
      aria-label={getButtonText()}
      aria-describedby="voice-input-description"
      aria-pressed={isRecording}
      type="button"
    >
      {getButtonContent()}
      <span className="ml-2 text-sm sr-only sm:not-sr-only">{getButtonText()}</span>
      <div id="voice-input-description" className="sr-only">
        {getAriaDescription()}
      </div>
    </Button>
  );
};

export default VoiceInputButton;
