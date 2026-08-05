import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/authentication/hooks/useAuth";

interface RouteGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

const RouteGuard = ({
  children,
  requiresAuth,
  requiresAdmin,
}: RouteGuardProps) => {
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white/90"></div>
      </div>
    );
  }

  const isSignedIn = status === "authenticated";

  if (requiresAuth && !isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (!requiresAuth && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  // UX-only redirect; the API still enforces authorization on every request.
  if (requiresAdmin && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RouteGuard;
