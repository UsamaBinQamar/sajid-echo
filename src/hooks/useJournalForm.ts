
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { sanitizeInput, rateLimiter } from '@/utils/securityUtils';

export const useJournalForm = () => {
  const [searchParams] = useSearchParams();
  const [isVoiceMode, setIsVoiceMode] = useState(searchParams.get("type") === "voice");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [loading, setSaving] = useState(false);
  const [showPromptCard, setShowPromptCard] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleTag = (tag: string) => {
    const sanitizedTag = sanitizeInput(tag);
    setSelectedTags(prev => 
      prev.includes(sanitizedTag) 
        ? prev.filter(t => t !== sanitizedTag)
        : [...prev, sanitizedTag]
    );
  };

  const addCustomTag = () => {
    const sanitizedTag = sanitizeInput(customTag);
    if (sanitizedTag && !selectedTags.includes(sanitizedTag)) {
      if (selectedTags.length >= 10) {
        toast({
          title: "Too many tags",
          description: "Maximum of 10 tags allowed per entry.",
          variant: "destructive",
        });
        return;
      }
      setSelectedTags(prev => [...prev, sanitizedTag]);
      setCustomTag("");
    }
  };

  const handleUsePrompt = (promptText: string) => {
    const sanitizedPrompt = sanitizeInput(promptText);
    setContent(prev => {
      const newContent = prev ? `${prev}\n\n${sanitizedPrompt}` : sanitizedPrompt;
      return newContent;
    });
  };

  const handleSave = async () => {
    // Rate limiting check
    if (!rateLimiter.checkLimit('journal_save')) {
      toast({
        title: "Too many requests",
        description: "Please wait before saving again.",
        variant: "destructive",
      });
      return;
    }

    const sanitizedContent = sanitizeInput(content);
    const sanitizedTitle = sanitizeInput(title);

    if (!sanitizedContent.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your journal entry.",
        variant: "destructive",
      });
      return;
    }

    if (sanitizedContent.length < 10) {
      toast({
        title: "Content too short",
        description: "Please write at least 10 characters for your reflection.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          title: sanitizedTitle || "Untitled Entry",
          content: sanitizedContent,
          entry_type: isVoiceMode ? "voice" : "text",
          tags: selectedTags.slice(0, 10), // Limit to 10 tags
        });

      if (error) throw error;

      toast({
        title: "Entry saved",
        description: "Your reflection has been safely stored.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Journal save error:', error);
      toast({
        title: "Error saving entry",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    isVoiceMode,
    setIsVoiceMode,
    title,
    setTitle,
    content,
    setContent,
    selectedTags,
    customTag,
    setCustomTag,
    loading,
    showPromptCard,
    setShowPromptCard,
    toggleTag,
    addCustomTag,
    handleUsePrompt,
    handleSave,
  };
};
