import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileSection from '@/components/profile/ProfileSection';
import GoalsAndPreferences from '@/components/profile/GoalsAndPreferences';
import AccountSettings from '@/components/profile/AccountSettings';

interface UserMenuProps {
  user: any;
  onSignOut?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const { navigationActions } = useNavigation();
  const { profile, loading, getDisplayName, getProfileCompleteness } =
    useUserProfile();

  const handleSignOut = async () => {
    const signOutAction = navigationActions.find(
      (action) => action.title === 'Sign Out'
    );
    if (signOutAction) {
      await signOutAction.action();
    }
    if (onSignOut) {
      onSignOut();
    }
  };

  if (!user) {
    return (
      <Button onClick={() => navigate('/auth')} variant="default" size="sm">
        Sign In
      </Button>
    );
  }

  const displayName = getDisplayName(user);
  const completeness = getProfileCompleteness();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border relative">
            <span className="text-foreground font-medium text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
            {completeness < 100 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#8A1503] rounded-full border border-white"></div>
            )}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-foreground text-sm font-medium block">
              {displayName}
            </span>
            {!loading && completeness < 100 && (
              <span className="text-xs text-muted-foreground">
                Profile {completeness}% complete
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 lg:w-80 bg-[#f3c012] text-white shadow-elevated border border-green-700 rounded-xl p-2"
      >
        {/* User Info Header */}
        <div className="px-2 py-3 border-b border-border">
          <div className="font-medium text-sm">{displayName}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
          {!loading && completeness < 100 && (
            <div className="text-xs text-orange-600 mt-1">
              Complete your profile to get personalized recommendations
            </div>
          )}
        </div>

        {/* Profile Settings Section */}
        <div className="py-2">
          <ProfileSection />
          <GoalsAndPreferences />
        </div>

        <DropdownMenuSeparator />

        {/* Account Settings Section */}
        <div className="py-2">
          <AccountSettings />
        </div>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <div className="py-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-auto p-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            <div className="flex-1 text-left">
              <div className="font-medium">Sign Out</div>
            </div>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
