
import { useNavigate } from "react-router-dom";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { navigationItems, secondaryNavigationItems, createNavigationActions } from "@/config/navigation";

export const useNavigation = () => {
  const navigate = useNavigate();
  const { secureSignOut } = useSecureAuth();

  const handleSignOut = async () => {
    await secureSignOut();
  };

  const primaryNavItems = navigationItems.filter(item => item.priority === 'primary');
  const secondaryNavItems = secondaryNavigationItems;
  const navigationActions = createNavigationActions(navigate, handleSignOut);

  return {
    primaryNavItems,
    secondaryNavItems,
    navigationActions,
    navigate,
  };
};
