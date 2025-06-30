
import { ReactNode } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireValidSession?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  fallback,
  requireValidSession = true 
}: ProtectedRouteProps) => {
  const { isLoading, isAuthenticated, hasValidSession } = useSecureAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:bg-black dark:bg-none dark:text-white">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#CEA358] mb-4" />
            <p className="text-gray-600 dark:text-white">Verifying authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || (requireValidSession && !hasValidSession)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Shield className="h-12 w-12 text-[#8A1503] mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 text-center">
              You need to be authenticated to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
