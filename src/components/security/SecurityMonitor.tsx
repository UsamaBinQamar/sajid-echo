
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SecurityEvent {
  type: 'unauthorized_access' | 'rls_violation' | 'auth_failure';
  details: string;
  timestamp: string;
  user_id?: string;
}

export const SecurityMonitor = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Monitor for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear any sensitive data from localStorage/sessionStorage
        localStorage.removeItem('journal_draft');
        sessionStorage.clear();
      }
      
      if (event === 'TOKEN_REFRESHED' && !session) {
        // Handle token refresh failures
        console.warn('Security Monitor: Token refresh failed');
        logSecurityEvent({
          type: 'auth_failure',
          details: 'Token refresh failed',
          timestamp: new Date().toISOString()
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      // Log security events (in production, send to monitoring service)
      console.warn('Security Event:', event);
      
      // Show user-friendly notification for certain events
      if (event.type === 'unauthorized_access') {
        toast({
          title: "Security Notice",
          description: "Unauthorized access attempt detected. Please contact support if this persists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  // This component doesn't render anything, it just monitors
  return null;
};
