
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  full_name: string | null;
  preferred_name: string | null;
  pronouns: string | null;
  focus_areas: string[] | null;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, preferred_name, pronouns, focus_areas')
          .eq('id', user.id)
          .single();

        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Listen for profile updates
    const channel = supabase
      .channel('profile-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles'
      }, () => {
        loadProfile();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getDisplayName = (user: any) => {
    if (!profile) return user?.email?.split('@')[0] || 'User';
    return profile.preferred_name || profile.full_name || user?.email?.split('@')[0] || 'User';
  };

  const getProfileCompleteness = () => {
    if (!profile) return 0;
    let completed = 0;
    let total = 4;
    
    if (profile.full_name) completed++;
    if (profile.preferred_name) completed++;
    if (profile.pronouns) completed++;
    if (profile.focus_areas && profile.focus_areas.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  return { profile, loading, getDisplayName, getProfileCompleteness };
};
