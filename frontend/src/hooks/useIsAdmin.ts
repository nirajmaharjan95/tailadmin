import { useAuth } from "@/features/authentication/hooks/useAuth";

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === "admin";
};
