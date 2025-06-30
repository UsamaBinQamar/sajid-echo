import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";
import QuickActions from "./header/QuickActions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNavMenu } from "@/components/navigation/MobileNavMenu";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  onSignOut?: () => void;
  showBreadcrumbs?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSignOut,
  showBreadcrumbs = true,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  // Don't show breadcrumbs on landing or auth pages
  const shouldShowBreadcrumbs =
    showBreadcrumbs &&
    !["/", "/auth", "/landing"].includes(location.pathname) &&
    user;

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 lg:space-x-8">
              <Logo />
              <Navigation user={user} />
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <QuickActions user={user} />
              <ThemeToggle />
              <UserMenu user={user} onSignOut={onSignOut} />
              <MobileNavMenu user={user} className="lg:hidden" />
              <MobileMenu user={user} className="md:hidden lg:hidden" />
            </div>
          </div>
        </div>
      </header>

      {shouldShowBreadcrumbs && <BreadcrumbNav />}
    </div>
  );
};

export default Header;
