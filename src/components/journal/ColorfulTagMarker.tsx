
import { X } from "lucide-react";

interface ColorfulTagMarkerProps {
  tag: string;
  color?: string;
  onRemove?: () => void;
  isSelected?: boolean;
  onClick?: () => void;
}

const tagColors = [
  "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800",
  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
  "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
  "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800"
];

const getTagColor = (tag: string) => {
  const index = tag.length % tagColors.length;
  return tagColors[index];
};

const ColorfulTagMarker = ({ 
  tag, 
  color, 
  onRemove, 
  isSelected = false, 
  onClick 
}: ColorfulTagMarkerProps) => {
  const tagColor = color || getTagColor(tag);
  
  return (
    <div
      className={`
        tag-marker border-2 transition-all duration-200
        ${tagColor}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <span className="font-ui font-medium text-sm">{tag}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-2 hover:bg-current hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default ColorfulTagMarker;
