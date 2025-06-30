
import React from 'react';
import { Button } from "@/components/ui/button";
import { getCategoryInfo } from '../utils/categoryMappings';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  scenarioCount?: Record<string, number>;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  scenarioCount = {}
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Browse by Category</h3>
      
      {/* Desktop: Horizontal scrolling tabs */}
      <div className="hidden md:flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          onClick={() => onCategoryChange('all')}
          className="whitespace-nowrap h-9 text-sm"
        >
          All Scenarios
          {scenarioCount.all && (
            <span className="ml-2 px-2 py-0.5 bg-background/20 rounded-full text-xs">
              {scenarioCount.all}
            </span>
          )}
        </Button>
        
        {categories.map(category => {
          const categoryInfo = getCategoryInfo(category);
          const count = scenarioCount[category] || 0;
          
          return (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => onCategoryChange(category)}
              className="whitespace-nowrap h-9 text-sm"
            >
              <span className="mr-2">{categoryInfo.icon}</span>
              {categoryInfo.label}
              {count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-background/20 rounded-full text-xs">
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Mobile: Grid layout */}
      <div className="md:hidden grid grid-cols-2 gap-2">
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          onClick={() => onCategoryChange('all')}
          className="h-12 text-xs flex flex-col items-center justify-center p-2"
        >
          <span className="font-medium">All Scenarios</span>
          {scenarioCount.all && (
            <span className="text-xs opacity-75">{scenarioCount.all} scenarios</span>
          )}
        </Button>
        
        {categories.map(category => {
          const categoryInfo = getCategoryInfo(category);
          const count = scenarioCount[category] || 0;
          
          return (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => onCategoryChange(category)}
              className="h-12 text-xs flex flex-col items-center justify-center p-2"
            >
              <span className="mb-1">{categoryInfo.icon}</span>
              <span className="font-medium line-clamp-1">{categoryInfo.label}</span>
              {count > 0 && (
                <span className="text-xs opacity-75">{count}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
