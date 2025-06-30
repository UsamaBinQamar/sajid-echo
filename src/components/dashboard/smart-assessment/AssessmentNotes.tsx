
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AssessmentNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const AssessmentNotes = ({ notes, onNotesChange }: AssessmentNotesProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes" className="text-sm font-medium">
        Any additional thoughts? (Optional)
      </Label>
      <Textarea
        id="notes"
        placeholder="What's on your mind today?"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="min-h-[60px]"
      />
    </div>
  );
};

export default AssessmentNotes;
