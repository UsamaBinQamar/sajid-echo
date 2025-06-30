
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import ExportDialog from "./ExportDialog";

const JournalExportButton = () => {
  return (
    <ExportDialog>
      <Button variant="ghost" size="sm">
        <FileDown className="h-4 w-4 mr-2" />
        Export Journal
      </Button>
    </ExportDialog>
  );
};

export default JournalExportButton;
