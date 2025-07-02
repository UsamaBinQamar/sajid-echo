
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const SUGGESTED_TAGS = [
  "growth", "reflection", "leadership", "boundaries", "stress", "gratitude",
  "challenges", "wins", "authenticity", "confidence", "burnout", "balance"
];

interface TagsSectionProps {
  selectedTags: string[];
  customTag: string;
  onTagToggle: (tag: string) => void;
  onCustomTagChange: (tag: string) => void;
  onAddCustomTag: () => void;
}

const TagsSection = ({
  selectedTags,
  customTag,
  onTagToggle,
  onCustomTagChange,
  onAddCustomTag
}: TagsSectionProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onAddCustomTag();
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Tag your reflection</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTED_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className={`cursor-pointer ${
              selectedTags.includes(tag) 
                ? "bg-gradient-to-r from-[#f3c012] to-blue-600" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <Input
          placeholder="Add custom tag"
          value={customTag}
          onChange={(e) => onCustomTagChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={onAddCustomTag} size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TagsSection;
