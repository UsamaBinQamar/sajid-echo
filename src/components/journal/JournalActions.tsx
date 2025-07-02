import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface JournalActionsProps {
  loading: boolean;
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const JournalActions = ({
  loading,
  canSave,
  onSave,
  onCancel,
}: JournalActionsProps) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={loading || !canSave}
        className="bg-gradient-to-r from-[#8A1503] to-[#f3c012] hover:from-[#7A1202] hover:to-[#B88D44] text-white"
      >
        {loading ? (
          <>Saving...</>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Entry
          </>
        )}
      </Button>
    </div>
  );
};

export default JournalActions;
