
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  user: any;
  className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ user, className }) => {
  const [open, setOpen] = useState(false);
  const { primaryNavItems, secondaryNavItems, navigationActions } = useNavigation();

  if (!user) return null;

  const primaryAction = navigationActions.find(action => 
    action.title === "New Journal Entry" && action.showOnMobile
  );

  const signOutAction = navigationActions.find(action => action.title === "Sign Out");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("md:hidden relative z-50", className)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left text-primary font-bold">
            EchoStrong
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Navigation Section */}
          <nav className="flex flex-col space-y-2 mt-6">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Navigation
            </div>
            {primaryNavItems
              .filter(item => item.showOnMobile && item.requiresAuth)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-primary bg-muted border border-border"
                        : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </NavLink>
              ))}
          </nav>

          {/* Actions Section */}
          {primaryAction && (
            <div className="pt-6 mt-6 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </div>
              <Button
                onClick={() => {
                  primaryAction.action();
                  setOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2"
                variant={primaryAction.variant || "default"}
              >
                {primaryAction.icon}
                {primaryAction.title}
              </Button>
            </div>
          )}

          {/* Account Section */}
          <div className="mt-auto pt-6 border-t border-border">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Account
            </div>
            <div className="space-y-2">
              {secondaryNavItems
                .filter(item => item.showOnMobile && item.requiresAuth)
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </NavLink>
                ))}
              
              {signOutAction && (
                <Button
                  onClick={() => {
                    signOutAction.action();
                    setOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {signOutAction.icon}
                  <span className="ml-3">{signOutAction.title}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
