
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Download, FileText, Table, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ExportDialogProps {
  children: React.ReactNode;
}

const ExportDialog = ({ children }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [scope, setScope] = useState<'complete' | 'date_range' | 'journal_only' | 'assessments_only'>('complete');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const exportRequest = {
        format,
        scope,
        ...(scope === 'date_range' && { startDate, endDate })
      };

      const response = await supabase.functions.invoke('export-user-data', {
        body: exportRequest,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      if (response.data.status === 'processing') {
        toast({
          title: "Export Started",
          description: "Your export is being processed. You'll receive an email when it's ready.",
        });
      } else {
        // Handle immediate download for smaller exports
        const blob = new Blob([JSON.stringify(response.data)], {
          type: format === 'csv' ? 'text/csv' : 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Export Complete",
          description: "Your data has been downloaded successfully.",
        });
      }

      setOpen(false);
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "An error occurred during export.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Formatted insights report with charts' },
    { value: 'csv', label: 'CSV Data', icon: Table, description: 'Raw data for analysis in Excel' },
    { value: 'json', label: 'JSON Data', icon: Code, description: 'Complete data dump for developers' }
  ];

  const scopeOptions = [
    { value: 'complete', label: 'Complete Export', description: 'All your data across all time periods' },
    { value: 'journal_only', label: 'Journal Only', description: 'Just your journal entries and reflections' },
    { value: 'assessments_only', label: 'Assessments Only', description: 'Assessment responses and patterns' },
    { value: 'date_range', label: 'Date Range', description: 'Data within a specific time period' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Your Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
              {formatOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="flex items-center cursor-pointer">
                      <option.icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Scope Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Export Scope</Label>
            <Select value={scope} onValueChange={(value: any) => setScope(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scopeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Inputs */}
          {scope === 'date_range' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Export Info */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <div className="font-medium text-blue-900 mb-1">Export Information</div>
            <div className="text-blue-700">
              {format === 'pdf' || scope === 'complete' 
                ? 'Large exports are processed in the background. You\'ll receive an email when ready.'
                : 'This export will download immediately.'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleExport}
              disabled={loading || (scope === 'date_range' && (!startDate || !endDate))}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
