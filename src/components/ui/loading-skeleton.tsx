
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'button' | 'list' | 'chart';
  className?: string;
  lines?: number;
}

export const LoadingSkeleton = ({ variant = 'card', className, lines = 3 }: LoadingSkeletonProps) => {
  switch (variant) {
    case 'card':
      return (
        <div className={cn("space-y-professional-sm p-professional-md border-professional rounded-professional", className)}>
          <div className="flex items-center space-x-professional-sm">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-professional-xs flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-professional-xs">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      );
    
    case 'text':
      return (
        <div className={cn("space-y-professional-xs", className)}>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      );
    
    case 'avatar':
      return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
    
    case 'button':
      return <Skeleton className={cn("h-10 w-24 rounded-professional", className)} />;
    
    case 'list':
      return (
        <div className={cn("space-y-professional-sm", className)}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex items-center space-x-professional-sm">
              <Skeleton className="h-8 w-8 rounded-professional-sm" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    
    case 'chart':
      return (
        <div className={cn("space-y-professional-sm", className)}>
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-professional-xs">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-end space-x-professional-xs">
                <Skeleton className={`h-${8 + i * 4} w-12`} />
                <Skeleton className={`h-${12 + i * 2} w-12`} />
                <Skeleton className={`h-${6 + i * 6} w-12`} />
              </div>
            ))}
          </div>
        </div>
      );
    
    default:
      return <Skeleton className={cn("h-4 w-full", className)} />;
  }
};
