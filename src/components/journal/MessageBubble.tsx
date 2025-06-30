
import { Button } from "@/components/ui/button";
import { X, Edit3 } from "lucide-react";

interface MessageBubbleProps {
  message: string;
  type: 'user' | 'ai';
  timestamp?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const MessageBubble = ({ 
  message, 
  type, 
  timestamp, 
  onEdit, 
  onDelete, 
  className = "" 
}: MessageBubbleProps) => {
  return (
    <div className={`message-bubble ${type} group ${className}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <p className="font-body leading-relaxed">{message}</p>
          {timestamp && (
            <span className="text-xs text-muted-foreground mt-2 block">
              {timestamp}
            </span>
          )}
        </div>
        
        {type === 'user' && (onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-6 w-6 p-0 hover:bg-primary/10"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
