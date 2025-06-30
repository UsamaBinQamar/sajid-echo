
import { supabase } from "@/integrations/supabase/client";

export interface VoiceRecordingLimits {
  can_record: boolean;
  recordings_used: number;
  recordings_limit: number;
  max_duration_minutes: number;
  tier_name: string;
}

class VoiceRecordingLimitsService {
  async checkVoiceRecordingLimits(): Promise<VoiceRecordingLimits | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc('can_create_voice_recording', {
        user_uuid: user.id
      });

      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error checking voice recording limits:', error);
      return null;
    }
  }

  async trackVoiceRecordingUsage(durationSeconds: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('track_voice_recording_usage', {
        user_uuid: user.id,
        duration_seconds: durationSeconds
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking voice recording usage:', error);
    }
  }

  formatRecordingLimits(limits: VoiceRecordingLimits): string {
    if (limits.recordings_limit === -1) {
      return `Daily recordings (${limits.max_duration_minutes} min max)`;
    }
    const remaining = limits.recordings_limit - limits.recordings_used;
    return `${remaining}/${limits.recordings_limit} recordings remaining this month (${limits.max_duration_minutes} min max)`;
  }

  getRemainingTime(limits: VoiceRecordingLimits): number {
    return limits.max_duration_minutes * 60; // Convert to seconds
  }
}

export const voiceRecordingLimitsService = new VoiceRecordingLimitsService();
