
import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface VoiceResponsePlayerProps {
  text: string;
  isGenerating: boolean;
  isPlaying: boolean;
  onPlayAudio: () => void;
  disabled?: boolean;
}

const VoiceResponsePlayer: React.FC<VoiceResponsePlayerProps> = ({
  text,
  isGenerating,
  isPlaying,
  onPlayAudio,
  disabled = false
}) => {
  if (!text.trim()) return null;

  const getButtonContent = () => {
    if (isGenerating) {
      return <Loader2 className="h-3 w-3 animate-spin" />;
    }
    
    if (isPlaying) {
      return <VolumeX className="h-3 w-3" />;
    }
    
    return <Volume2 className="h-3 w-3" />;
  };

  const getAriaLabel = () => {
    if (isGenerating) return "Generating audio for message";
    if (isPlaying) return "Stop audio playback";
    return "Play message audio";
  };

  const getAriaDescription = () => {
    const messagePreview = text.length > 50 ? `${text.substring(0, 50)}...` : text;
    
    if (isGenerating) {
      return `Generating audio for message: "${messagePreview}"`;
    }
    if (isPlaying) {
      return `Currently playing audio for message: "${messagePreview}". Press to stop.`;
    }
    return `Press to hear audio version of message: "${messagePreview}"`;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onPlayAudio}
      disabled={disabled || isGenerating}
      className="h-6 w-6 p-0 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      aria-label={getAriaLabel()}
      aria-describedby="voice-player-description"
      aria-pressed={isPlaying}
      type="button"
    >
      {getButtonContent()}
      <div id="voice-player-description" className="sr-only">
        {getAriaDescription()}
      </div>
    </Button>
  );
};

export default VoiceResponsePlayer;
