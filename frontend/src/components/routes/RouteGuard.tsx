import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

interface RouteGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
}

const RouteGuard = ({ children, requiresAuth }: RouteGuardProps) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white/90"></div>
      </div>
    );
  }

  if (requiresAuth && !isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (!requiresAuth && isSignedIn) {
    return <Navigate to="/employees" replace />;
  }

  return children;
};

export default RouteGuard;
