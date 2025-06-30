
import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { tagCategories } from '../../utils/categoryMappings';

interface TagCategoriesProps {
  applyQuickFilter: (searchTerms: string[]) => void;
}

const TagCategories: React.FC<TagCategoriesProps> = ({ applyQuickFilter }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Browse by focus area:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(tagCategories).map(([key, category]) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(category.tags)}
            className={`text-xs border transition-colors ${category.color}`}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TagCategories;
