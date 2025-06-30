
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import VoiceInputButton from "./VoiceInputButton";

interface ResponseInputProps {
  currentResponse: string;
  setCurrentResponse: (value: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
}

const ResponseInput: React.FC<ResponseInputProps> = ({
  currentResponse,
  setCurrentResponse,
  isLoading,
  onSendMessage
}) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    isRecording,
    isProcessing,
    recordingTime,
    hasPermission,
    startRecording,
    stopRecording,
  } = useVoiceRecording();

  const handleVoiceToggle = async () => {
    if (isRecording) {
      setStatusMessage("Processing voice input...");
      const transcript = await stopRecording();
      if (transcript) {
        // Append to existing response or replace if empty
        const newResponse = currentResponse.trim() 
          ? `${currentResponse} ${transcript}` 
          : transcript;
        setCurrentResponse(newResponse);
        setStatusMessage("Voice input added to response");
        
        // Focus back to textarea for continued editing
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      } else {
        setStatusMessage("Voice input failed");
      }
    } else {
      setStatusMessage("Voice recording started");
      await startRecording();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !isLoading && currentResponse.trim()) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResponse.trim() || isLoading || isVoiceMode) return;
    onSendMessage();
  };

  useEffect(() => {
    setIsVoiceMode(isRecording || isProcessing);
  }, [isRecording, isProcessing]);

  // Clear status messages after a delay
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const getTextareaLabel = () => {
    if (isVoiceMode) {
      return isRecording ? "Voice recording in progress" : "Processing voice input";
    }
    return "Enter your response to the dialogue scenario";
  };

  return (
    <>
      {/* Status announcements for screen readers */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {statusMessage}
      </div>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} role="form" aria-label="Response input form">
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label htmlFor="response-textarea" className="sr-only">
                    {getTextareaLabel()}
                  </label>
                  <Textarea
                    id="response-textarea"
                    ref={textareaRef}
                    placeholder="How do you respond? Take your time to consider your words carefully..."
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[100px] focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    disabled={isLoading || isVoiceMode}
                    aria-describedby="response-help response-status"
                    aria-invalid={false}
                    aria-required={true}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <VoiceInputButton
                    isRecording={isRecording}
                    isProcessing={isProcessing}
                    hasPermission={hasPermission}
                    onToggleRecording={handleVoiceToggle}
                    recordingTime={recordingTime}
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p id="response-help" className="text-xs text-gray-500">
                    Think about empathy, clarity, and inclusion in your response
                    <span className="block mt-1">
                      Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to send
                    </span>
                  </p>
                  <div id="response-status" aria-live="polite">
                    {isVoiceMode && (
                      <p className="text-xs text-blue-600 mt-1">
                        {isRecording ? "🔴 Recording your voice..." : "⏳ Processing speech..."}
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={!currentResponse.trim() || isLoading || isVoiceMode}
                  className="bg-gradient-to-r from-[#CEA358] to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-describedby="send-button-help"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                      Send Response
                    </>
                  )}
                </Button>
                <div id="send-button-help" className="sr-only">
                  {!currentResponse.trim() 
                    ? "Enter a response to enable sending" 
                    : isLoading 
                    ? "Response is being processed" 
                    : "Send your response to continue the dialogue"
                  }
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ResponseInput;
