import RouteGuard from "./RouteGuard";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  return <RouteGuard requiresAuth={false}>{children}</RouteGuard>;
};

export default PublicRoute;
