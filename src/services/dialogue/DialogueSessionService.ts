
import { supabase } from "@/integrations/supabase/client";

export interface DialogueSession {
  id: string;
  user_id: string;
  scenario_id: string;
  status: string;
  created_at: string;
  started_at: string;
  completed_at?: string;
  final_scores?: any;
  session_notes?: string;
}

export class DialogueSessionService {
  static async createSession(userId: string, scenarioId: string): Promise<DialogueSession | null> {
    try {
      const { data: session, error } = await supabase
        .from('dialogue_sessions')
        .insert({
          user_id: userId,
          scenario_id: scenarioId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error creating dialogue session:', error);
      return null;
    }
  }

  static async updateSessionStatus(sessionId: string, status: string, finalScores?: any): Promise<boolean> {
    try {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        if (finalScores) {
          updateData.final_scores = finalScores;
        }
      }

      const { error } = await supabase
        .from('dialogue_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating session status:', error);
      return false;
    }
  }

  static async getSession(sessionId: string): Promise<DialogueSession | null> {
    try {
      const { data: session, error } = await supabase
        .from('dialogue_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }
}
