
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthState {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasValidSession: boolean;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasValidSession: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAuthState = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          if (mounted) {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              hasValidSession: false
            });
          }
          return;
        }

        if (session?.user) {
          // Verify session is still valid by making a test query
          const { error: testError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (testError && testError.code === 'PGRST301') {
            // RLS policy blocked the query - session is invalid
            console.warn('Invalid session detected');
            await supabase.auth.signOut();
            if (mounted) {
              setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                hasValidSession: false
              });
            }
            return;
          }

          if (mounted) {
            setAuthState({
              user: session.user,
              isLoading: false,
              isAuthenticated: true,
              hasValidSession: true
            });
          }
        } else {
          if (mounted) {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              hasValidSession: false
            });
          }
        }
      } catch (error) {
        console.error('Auth state check failed:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            hasValidSession: false
          });
        }
      }
    };

    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          if (mounted) {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              hasValidSession: false
            });
          }
        } else if (event === 'SIGNED_IN' && session) {
          if (mounted) {
            setAuthState({
              user: session.user,
              isLoading: false,
              isAuthenticated: true,
              hasValidSession: true
            });
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const requireAuth = (redirectTo: string = '/auth') => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature.",
        variant: "destructive",
      });
      navigate(redirectTo);
      return false;
    }
    return true;
  };

  const secureSignOut = async () => {
    try {
      // Clear sensitive data before signing out
      localStorage.removeItem('journal_draft');
      sessionStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Sign Out Error",
          description: "There was an issue signing you out. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You have been securely signed out.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Secure sign out failed:', error);
    }
  };

  return {
    ...authState,
    requireAuth,
    secureSignOut
  };
};
