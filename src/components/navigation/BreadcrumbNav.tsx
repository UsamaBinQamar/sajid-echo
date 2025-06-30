
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/auth': 'Authentication',
  '/landing': 'Welcome',
  '/insights': 'Insights',
  '/journal': 'Journal',
  '/dialogue-simulator': 'Dialogue Practice',
  '/subscription': 'Subscription',
  '/teams': 'Teams',
  '/onboarding': 'Getting Started',
};

export const BreadcrumbNav = ({ items, className, showHome = true }: BreadcrumbNavProps) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Generate breadcrumbs from current path if items not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathSegments, showHome);
  
  if (breadcrumbItems.length <= 1 && !showHome) {
    return null;
  }

  return (
    <div className={cn("py-professional-xs px-professional-md bg-professional-soft border-b border-border", className)}>
      <div className="container mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            {showHome && !items && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center hover:text-primary transition-professional">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}
              </>
            )}
            
            {breadcrumbItems.map((item, index) => (
              <BreadcrumbItem key={index}>
                {item.current || index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage className="font-medium text-foreground">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href || '#'} 
                        className="hover:text-primary transition-professional"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

function generateBreadcrumbsFromPath(pathSegments: string[], showHome: boolean): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];
  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    items.push({
      label,
      href: currentPath,
      current: index === pathSegments.length - 1
    });
  });
  
  return items;
}
