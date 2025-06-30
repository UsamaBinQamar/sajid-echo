
export interface NavigationItem {
  title: string;
  to: string;
  icon: React.ReactNode;
  priority: 'primary' | 'secondary' | 'action';
  showOnMobile: boolean;
  showOnDesktop: boolean;
  requiresAuth: boolean;
}

export interface NavigationAction {
  title: string;
  shortTitle?: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  showOnMobile: boolean;
  showOnDesktop: boolean;
  requiresAuth: boolean;
}
