
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Brain, BookOpen, BarChart3, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home, description: "Your leadership overview" },
  { label: "Smart Assessment", href: "/dashboard", icon: Brain, description: "AI-powered insights" },
  { label: "Journal", href: "/journal", icon: BookOpen, description: "Reflective journaling" },
  { label: "Insights", href: "/insights", icon: BarChart3, description: "Progress analytics" },
  { label: "Dialogue Practice", href: "/dialogue-simulator", icon: Users, description: "Practice conversations" },
  { label: "Subscription", href: "/subscription", icon: Settings, description: "Manage your plan" },
];

interface MobileNavMenuProps {
  user?: any;
  className?: string;
}

export const MobileNavMenu = ({ user, className }: MobileNavMenuProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", className)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-professional-md border-b border-border">
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col space-y-1 p-professional-sm">
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center space-x-professional-sm px-professional-sm py-professional-sm rounded-professional transition-professional group",
                  "hover:bg-muted focus:bg-muted focus:outline-none",
                  isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-professional",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-medium transition-professional",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
        
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-professional-sm border-t border-border bg-professional-subtle">
            <div className="flex items-center space-x-professional-sm">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
