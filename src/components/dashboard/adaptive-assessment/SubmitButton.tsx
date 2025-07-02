
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}

const SubmitButton = ({ isSubmitting, canSubmit, onSubmit }: SubmitButtonProps) => {
  return (
    <Button
      onClick={onSubmit}
      disabled={isSubmitting || !canSubmit}
      className="w-full bg-gradient-to-r from-[#f3c012] to-blue-600 hover:from-purple-700 hover:to-blue-700"
    >
      {isSubmitting ? (
        "Submitting..."
      ) : (
        <>
          Submit Responses
          <ChevronRight className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
