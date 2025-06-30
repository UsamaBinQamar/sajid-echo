
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTextToSpeech = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const generateAndPlaySpeech = async (text: string, voice: string = 'alloy') => {
    if (!text.trim()) return;

    setIsGenerating(true);

    try {
      console.log('🔄 Generating speech for text:', text.substring(0, 50) + '...');

      // Call the text-to-speech edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });

      if (error) {
        console.error('❌ TTS error:', error);
        throw error;
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Create audio blob and play
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Audio Playback Error",
          description: "Failed to play the generated audio.",
          variant: "destructive",
        });
      };

      await audio.play();
      console.log('✅ Audio playback started');

    } catch (error) {
      console.error('❌ Error generating speech:', error);
      toast({
        title: "Speech Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate speech.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAndPlaySpeech,
    isGenerating,
    isPlaying,
  };
};
