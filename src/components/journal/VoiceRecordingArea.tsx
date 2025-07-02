
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Loader2, Crown, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VoiceRecordingAreaProps {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: string;
  hasPermission: boolean | null;
  content: string;
  onRecordingToggle: () => void;
  voiceLimits?: any;
  isLoadingLimits?: boolean;
  remainingSeconds?: number;
}

const VoiceRecordingArea = ({
  isRecording,
  isProcessing,
  recordingTime,
  hasPermission,
  content,
  onRecordingToggle,
  voiceLimits,
  isLoadingLimits,
  remainingSeconds = 0
}: VoiceRecordingAreaProps) => {
  const navigate = useNavigate();

  const getProgressValue = () => {
    if (!voiceLimits) return 0;
    const maxSeconds = voiceLimits.max_duration_minutes * 60;
    const currentSeconds = maxSeconds - remainingSeconds;
    return (currentSeconds / maxSeconds) * 100;
  };

  const shouldShowWarning = () => {
    return remainingSeconds <= 60 && remainingSeconds > 0 && isRecording;
  };

  return (
    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-6">
      {/* Limits Display */}
      {!isLoadingLimits && voiceLimits && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            <Badge variant="outline" className="text-primary border-primary/30">
              {voiceLimits.tier_name}
            </Badge>
          </div>
          
          {voiceLimits.recordings_limit !== -1 && (
            <div className="text-sm text-muted-foreground">
              {voiceLimits.recordings_used}/{voiceLimits.recordings_limit} recordings used this month
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            Max duration: {voiceLimits.max_duration_minutes} minutes per recording
          </div>
        </div>
      )}

      {/* Recording Progress Bar */}
      {isRecording && voiceLimits && (
        <div className="space-y-2">
          <Progress value={getProgressValue()} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Duration: {recordingTime}</span>
            <span>Remaining: {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
          {shouldShowWarning() && (
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Less than 1 minute remaining!</span>
            </div>
          )}
        </div>
      )}

      {/* Recording Button */}
      <Button
        onClick={onRecordingToggle}
        disabled={isProcessing || hasPermission === false || (!voiceLimits?.can_record && !isRecording)}
        className={`h-20 w-20 rounded-full ${
          isRecording 
            ? "bg-[#8A1503] animate-pulse hover:bg-red-600" 
            : "bg-gradient-to-r from-[#f3c012] to-blue-600 hover:from-purple-700 hover:to-blue-700"
        }`}
      >
        {isProcessing ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </Button>
      
      {/* Status Messages */}
      <div className="mt-4">
        {hasPermission === false ? (
          <p className="text-destructive">
            Microphone access denied. Please enable microphone permissions.
          </p>
        ) : isProcessing ? (
          <p className="text-primary">
            Processing your recording...
          </p>
        ) : isRecording ? (
          <div>
            <p className="text-red-600 font-medium">Recording... {recordingTime}</p>
            <p className="text-sm text-muted-foreground mt-1">Tap to stop recording</p>
          </div>
        ) : !voiceLimits?.can_record ? (
          <div className="space-y-3">
            <p className="text-destructive font-medium">
              Recording limit reached for {voiceLimits?.tier_name} plan
            </p>
            <p className="text-sm text-muted-foreground">
              {voiceLimits?.recordings_limit !== -1 
                ? `You've used all ${voiceLimits.recordings_limit} recordings this month`
                : "Please check your subscription status"
              }
            </p>
            <Button 
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-[#f3c012] to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground">
              Tap to start recording your thoughts
            </p>
            {voiceLimits && (
              <p className="text-xs text-muted-foreground mt-1">
                Max {voiceLimits.max_duration_minutes} minutes per recording
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Transcribed Content */}
      {content && (
        <div className="mt-4 p-4 bg-muted rounded-lg text-left">
          <p className="text-sm text-muted-foreground mb-2">Transcribed:</p>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecordingArea;
