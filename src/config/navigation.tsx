
import { HomeIcon, BookOpen, BarChart3, MessageCircle, Crown, User, LogOut, Plus } from "lucide-react";
import { NavigationItem, NavigationAction } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <HomeIcon className="h-4 w-4" />,
    priority: 'primary',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    title: "Journal",
    to: "/journal",
    icon: <BookOpen className="h-4 w-4" />,
    priority: 'primary',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    title: "Leadership Simulator",
    to: "/dialogue-simulator",
    icon: <MessageCircle className="h-4 w-4" />,
    priority: 'primary',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    title: "Insights",
    to: "/insights",
    icon: <BarChart3 className="h-4 w-4" />,
    priority: 'primary',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
];

// Remove secondary navigation items since settings are now in profile dropdown
export const secondaryNavigationItems: NavigationItem[] = [];

export const createNavigationActions = (navigate: (path: string) => void, signOut: () => void): NavigationAction[] => [
  {
    title: "New Journal Entry",
    shortTitle: "New Entry",
    icon: <Plus className="h-4 w-4" />,
    action: () => navigate('/journal'),
    variant: 'default',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    title: "Sign Out",
    icon: <LogOut className="h-4 w-4" />,
    action: signOut,
    variant: 'ghost',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
];
