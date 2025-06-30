
import SecureJournalWrapper from "@/components/journal/SecureJournalWrapper";
import JournalForm from "@/components/journal/JournalForm";
import { useJournalForm } from "@/hooks/useJournalForm";

const Journal = () => {
  const {
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
  } = useJournalForm();

  return (
    <SecureJournalWrapper>
      <JournalForm
        isVoiceMode={isVoiceMode}
        onModeChange={setIsVoiceMode}
        title={title}
        onTitleChange={setTitle}
        content={content}
        onContentChange={setContent}
        selectedTags={selectedTags}
        customTag={customTag}
        onTagToggle={toggleTag}
        onCustomTagChange={setCustomTag}
        onAddCustomTag={addCustomTag}
        loading={loading}
        onSave={handleSave}
        showPromptCard={showPromptCard}
        onDismissPrompt={() => setShowPromptCard(false)}
        onUsePrompt={handleUsePrompt}
      />
    </SecureJournalWrapper>
  );
};

export default Journal;
