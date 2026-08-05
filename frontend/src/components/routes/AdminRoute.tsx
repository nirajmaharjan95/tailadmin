import RouteGuard from "./RouteGuard";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  return (
    <RouteGuard requiresAuth={true} requiresAdmin={true}>
      {children}
    </RouteGuard>
  );
};

export default AdminRoute;
