
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quickMode, setQuickMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  const handleToggleQuick = (enabled: boolean) => {
    setQuickMode(enabled);
  };

  const handleToggleFocus = (enabled: boolean) => {
    setFocusMode(enabled);
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Leader';

  return {
    user,
    loading,
    quickMode,
    focusMode,
    userName,
    navigate,
    handleToggleQuick,
    handleToggleFocus,
  };
};
