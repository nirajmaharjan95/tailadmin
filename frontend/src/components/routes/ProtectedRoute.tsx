import RouteGuard from "./RouteGuard";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  return <RouteGuard requiresAuth={true}>{children}</RouteGuard>;
};

export default ProtectedRoute;
