
import { Card, CardContent } from "@/components/ui/card";
import JournalHeader from "./JournalHeader";
import JournalContentInput from "./JournalContentInput";
import TagsSection from "./TagsSection";
import JournalActions from "./JournalActions";
import ReflectionPromptCard from "./ReflectionPromptCard";
import { useNavigate } from "react-router-dom";

interface JournalFormProps {
  isVoiceMode: boolean;
  onModeChange: (isVoice: boolean) => void;
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onContentChange: (content: string) => void;
  selectedTags: string[];
  customTag: string;
  onTagToggle: (tag: string) => void;
  onCustomTagChange: (tag: string) => void;
  onAddCustomTag: () => void;
  loading: boolean;
  onSave: () => void;
  showPromptCard: boolean;
  onDismissPrompt: () => void;
  onUsePrompt: (prompt: string) => void;
}

const JournalForm = ({
  isVoiceMode,
  onModeChange,
  title,
  onTitleChange,
  content,
  onContentChange,
  selectedTags,
  customTag,
  onTagToggle,
  onCustomTagChange,
  onAddCustomTag,
  loading,
  onSave,
  showPromptCard,
  onDismissPrompt,
  onUsePrompt,
}: JournalFormProps) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Reflection Prompt Card */}
      {showPromptCard && (
        <div className="mb-6">
          <ReflectionPromptCard
            onUsePrompt={onUsePrompt}
            onDismiss={onDismissPrompt}
          />
        </div>
      )}

      <Card className="shadow-lg">
        <JournalHeader 
          isVoiceMode={isVoiceMode}
          onModeChange={onModeChange}
        />
        
        <CardContent className="space-y-6">
          <JournalContentInput
            isVoiceMode={isVoiceMode}
            title={title}
            content={content}
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
          />

          {/* Tags */}
          <TagsSection
            selectedTags={selectedTags}
            customTag={customTag}
            onTagToggle={onTagToggle}
            onCustomTagChange={onCustomTagChange}
            onAddCustomTag={onAddCustomTag}
          />

          {/* Save Button */}
          <JournalActions
            loading={loading}
            canSave={!!content.trim()}
            onSave={onSave}
            onCancel={() => navigate("/dashboard")}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default JournalForm;
