
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VoiceRecordingArea from "./VoiceRecordingArea";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useEffect } from "react";
import { sanitizeInput } from "@/utils/securityUtils";

interface JournalContentInputProps {
  isVoiceMode: boolean;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

const JournalContentInput = ({
  isVoiceMode,
  title,
  content,
  onTitleChange,
  onContentChange,
}: JournalContentInputProps) => {
  const {
    isRecording,
    isProcessing,
    recordingTime,
    hasPermission,
    voiceLimits,
    isLoadingLimits,
    remainingSeconds,
    startRecording,
    stopRecording,
    checkPermission,
  } = useVoiceRecording();

  // Check microphone permission when switching to voice mode
  useEffect(() => {
    if (isVoiceMode && hasPermission === null) {
      checkPermission();
    }
  }, [isVoiceMode, hasPermission, checkPermission]);

  const handleVoiceRecording = async () => {
    if (isRecording) {
      const transcribedText = await stopRecording();
      if (transcribedText) {
        const sanitizedText = sanitizeInput(transcribedText);
        onContentChange(content + (content ? ' ' : '') + sanitizedText);
      }
    } else {
      await startRecording();
    }
  };

  return (
    <>
      {/* Title */}
      <div>
        <Input
          placeholder="Give your reflection a title (optional)"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-lg font-medium"
          maxLength={200}
        />
      </div>

      {/* Content */}
      <div>
        {isVoiceMode ? (
          <VoiceRecordingArea
            isRecording={isRecording}
            isProcessing={isProcessing}
            recordingTime={recordingTime}
            hasPermission={hasPermission}
            content={content}
            onRecordingToggle={handleVoiceRecording}
            voiceLimits={voiceLimits}
            isLoadingLimits={isLoadingLimits}
            remainingSeconds={remainingSeconds}
          />
        ) : (
          <Textarea
            placeholder="What's coming up for you today? What's been taking up space in your mind and leadership lately? What do you need to say to move forward with clarity? Let your thoughts flow freely..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-48 text-base leading-relaxed"
            maxLength={10000}
          />
        )}
      </div>
    </>
  );
};

export default JournalContentInput;
