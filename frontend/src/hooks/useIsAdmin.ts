import { useUser } from "@clerk/clerk-react";

export const useIsAdmin = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role === "admin";
};
