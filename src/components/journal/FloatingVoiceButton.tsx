
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Square, Crown } from "lucide-react";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useNavigate } from "react-router-dom";

interface FloatingVoiceButtonProps {
  onTranscription: (text: string) => void;
  isActive?: boolean;
}

const FloatingVoiceButton = ({ onTranscription, isActive = false }: FloatingVoiceButtonProps) => {
  const { 
    isRecording, 
    isProcessing, 
    recordingTime, 
    hasPermission, 
    voiceLimits,
    remainingSeconds,
    startRecording, 
    stopRecording, 
    checkPermission 
  } = useVoiceRecording();
  
  const navigate = useNavigate();

  const handleToggleRecording = async () => {
    if (isRecording) {
      const transcription = await stopRecording();
      if (transcription) {
        onTranscription(transcription);
      }
    } else {
      await startRecording();
    }
  };

  // Check if browser supports media recording
  const isSupported = typeof navigator !== 'undefined' && 
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  if (!isSupported) {
    return null;
  }

  // Don't show if user can't record (but allow stopping current recording)
  if (!voiceLimits?.can_record && !isRecording) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative">
          <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-warm mb-2">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-xs font-ui font-medium text-foreground">
                Recording limit reached
              </span>
            </div>
          </div>
          <Button
            onClick={() => navigate('/subscription')}
            className="w-16 h-16 rounded-full shadow-warm transition-all duration-300 hover-lift bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-primary-foreground"
            size="icon"
          >
            <Crown className="h-6 w-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        <Button
          onClick={handleToggleRecording}
          disabled={isProcessing}
          className={`
            w-16 h-16 rounded-full shadow-warm transition-all duration-300 hover-lift
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse-soft' 
              : 'btn-gradient text-primary-foreground'
            }
          `}
          size="icon"
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : isRecording ? (
            <Square className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>

        {isRecording && (
          <div className="absolute -top-2 -left-2 w-20 h-20 rounded-full border-4 border-red-300 animate-ping"></div>
        )}

        {isRecording && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-warm">
            <div className="flex items-center gap-2">
              <div className="waveform">
                <div className="waveform-bar h-3"></div>
                <div className="waveform-bar h-4"></div>
                <div className="waveform-bar h-2"></div>
                <div className="waveform-bar h-5"></div>
                <div className="waveform-bar h-3"></div>
              </div>
              <span className="text-xs font-ui font-medium text-foreground">
                {recordingTime}
              </span>
              {remainingSeconds <= 60 && remainingSeconds > 0 && (
                <Badge variant="outline" className="text-amber-600 border-amber-600/30">
                  {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Show tier info when not recording */}
        {!isRecording && voiceLimits && voiceLimits.recordings_limit !== -1 && (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-2 py-1 shadow-warm">
            <span className="text-xs font-ui text-muted-foreground">
              {voiceLimits.recordings_limit - voiceLimits.recordings_used} left
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingVoiceButton;
