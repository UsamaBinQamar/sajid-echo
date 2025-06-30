
import { LoadingSkeleton } from "./loading-skeleton";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  variant?: 'dashboard' | 'list' | 'form' | 'details';
  className?: string;
  title?: string;
}

export const PageLoader = ({ variant = 'dashboard', className, title }: PageLoaderProps) => {
  return (
    <div className={cn("space-y-professional-md p-professional-md", className)}>
      {title && (
        <div className="space-y-professional-xs">
          <LoadingSkeleton variant="text" lines={1} className="h-8 w-1/3" />
          <LoadingSkeleton variant="text" lines={1} className="h-4 w-2/3" />
        </div>
      )}
      
      {variant === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-professional-md">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-professional-md">
            <LoadingSkeleton variant="chart" />
            <LoadingSkeleton variant="list" lines={4} />
          </div>
        </>
      )}
      
      {variant === 'list' && (
        <div className="space-y-professional-sm">
          <LoadingSkeleton variant="list" lines={6} />
        </div>
      )}
      
      {variant === 'form' && (
        <div className="max-w-2xl space-y-professional-md">
          <LoadingSkeleton variant="text" lines={1} className="h-6 w-1/4" />
          <LoadingSkeleton variant="card" lines={2} />
          <LoadingSkeleton variant="text" lines={1} className="h-6 w-1/4" />
          <LoadingSkeleton variant="card" lines={3} />
          <div className="flex space-x-professional-sm">
            <LoadingSkeleton variant="button" />
            <LoadingSkeleton variant="button" />
          </div>
        </div>
      )}
      
      {variant === 'details' && (
        <div className="space-y-professional-md">
          <LoadingSkeleton variant="card" lines={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-professional-sm">
            <LoadingSkeleton variant="card" lines={2} />
            <LoadingSkeleton variant="card" lines={2} />
          </div>
        </div>
      )}
    </div>
  );
};
