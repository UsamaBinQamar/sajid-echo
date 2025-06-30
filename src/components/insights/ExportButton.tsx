
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ExportDialog from "./ExportDialog";

const ExportButton = () => {
  return (
    <ExportDialog>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>
    </ExportDialog>
  );
};

export default ExportButton;
