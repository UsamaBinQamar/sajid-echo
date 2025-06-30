
import { NavLink } from "react-router-dom";
import { useNavigation } from "@/hooks/useNavigation";

interface NavigationProps {
  user: any;
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const { primaryNavItems } = useNavigation();

  if (!user) return null;

  return (
    <nav className="hidden md:flex items-center space-x-2">
      {primaryNavItems
        .filter(item => item.showOnDesktop && item.requiresAuth)
        .map(item => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({ isActive }) => `
              flex items-center px-professional-sm py-professional-xs rounded-professional text-foreground font-medium hover:bg-muted theme-transition ${isActive ? 'bg-primary text-primary-foreground' : ''}
            `}
          >
            {({ isActive }) => (
              <>
                <span className="mr-2 transition-transform duration-200 hover:scale-110">
                  {item.icon}
                </span>
                {item.title}
              </>
            )}
          </NavLink>
        ))}
    </nav>
  );
};

export default Navigation;
