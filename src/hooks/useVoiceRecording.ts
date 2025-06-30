
import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { voiceRecordingLimitsService, VoiceRecordingLimits } from '@/services/subscription/voiceRecordingLimits';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [voiceLimits, setVoiceLimits] = useState<VoiceRecordingLimits | null>(null);
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  // Load voice recording limits on mount
  useEffect(() => {
    const loadLimits = async () => {
      setIsLoadingLimits(true);
      const limits = await voiceRecordingLimitsService.checkVoiceRecordingLimits();
      setVoiceLimits(limits);
      setIsLoadingLimits(false);
    };
    loadLimits();
  }, []);

  // Check microphone permission
  const checkPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice recording.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Check if user can start recording
  const canStartRecording = useCallback(async () => {
    if (!voiceLimits) {
      toast({
        title: "Loading Limits",
        description: "Please wait while we check your recording limits.",
        variant: "destructive",
      });
      return false;
    }

    if (!voiceLimits.can_record) {
      toast({
        title: "Recording Limit Reached",
        description: `You've reached your ${voiceLimits.tier_name} plan limit of ${voiceLimits.recordings_limit} recordings this month. Upgrade to get more recordings.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [voiceLimits, toast]);

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Start recording timer
  const startTimer = () => {
    setRecordingTime(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      setRecordingTime(elapsed);
      
      // Check if we're approaching the limit
      if (voiceLimits) {
        const maxSeconds = voiceLimits.max_duration_minutes * 60;
        if (elapsed >= maxSeconds - 30 && elapsed < maxSeconds) {
          toast({
            title: "Recording Time Warning",
            description: `You have ${maxSeconds - elapsed} seconds remaining.`,
          });
        } else if (elapsed >= maxSeconds) {
          // Auto-stop recording when limit is reached
          stopRecording();
          toast({
            title: "Recording Stopped",
            description: `Maximum recording time of ${voiceLimits.max_duration_minutes} minutes reached.`,
            variant: "destructive",
          });
        }
      }
    }, 1000);
  };

  // Stop recording timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start recording
  const startRecording = useCallback(async () => {
    const hasAccess = await checkPermission();
    if (!hasAccess) return;

    const canRecord = await canStartRecording();
    if (!canRecord) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      startTimer();

      toast({
        title: "Recording Started",
        description: voiceLimits ? `Max duration: ${voiceLimits.max_duration_minutes} minutes` : "Speak clearly into your microphone.",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check your microphone.",
        variant: "destructive",
      });
    }
  }, [checkPermission, canStartRecording, toast, voiceLimits]);

  // Stop recording and process
  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!mediaRecorderRef.current || !isRecording) return null;

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;
      const recordingDuration = recordingTime;
      
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        stopTimer();

        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          if (audioBlob.size === 0) {
            throw new Error('No audio data recorded');
          }

          const base64Audio = await blobToBase64(audioBlob);

          toast({
            title: "Processing Audio",
            description: "Converting speech to text...",
          });

          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });

          if (error) {
            console.error('Transcription error:', error);
            throw error;
          }

          if (!data?.text) {
            throw new Error('No transcription received');
          }

          // Track usage after successful transcription
          await voiceRecordingLimitsService.trackVoiceRecordingUsage(recordingDuration);
          
          // Refresh limits
          const updatedLimits = await voiceRecordingLimitsService.checkVoiceRecordingLimits();
          setVoiceLimits(updatedLimits);

          toast({
            title: "Transcription Complete",
            description: "Your speech has been converted to text.",
          });

          resolve(data.text);

        } catch (error) {
          console.error('Error processing audio:', error);
          toast({
            title: "Transcription Failed",
            description: error instanceof Error ? error.message : "Failed to convert speech to text.",
            variant: "destructive",
          });
          resolve(null);
        } finally {
          setIsProcessing(false);
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          chunksRef.current = [];
        }
      };

      mediaRecorder.stop();
    });
  }, [isRecording, recordingTime, toast]);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get remaining time for current tier
  const getRemainingSeconds = () => {
    if (!voiceLimits) return 0;
    return Math.max(0, (voiceLimits.max_duration_minutes * 60) - recordingTime);
  };

  return {
    isRecording,
    isProcessing,
    recordingTime: formatTime(recordingTime),
    hasPermission,
    voiceLimits,
    isLoadingLimits,
    remainingSeconds: getRemainingSeconds(),
    startRecording,
    stopRecording,
    checkPermission,
    refreshLimits: async () => {
      const limits = await voiceRecordingLimitsService.checkVoiceRecordingLimits();
      setVoiceLimits(limits);
    }
  };
};
