import { useCallback, useEffect, useState, type ReactNode } from "react";
import { getInitialSidebarState, SidebarContext } from "./SidebarContext";

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebarState);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));

    return () => {
      localStorage.removeItem("sidebarOpen");
    };
  }, [isSidebarOpen]);

  const toggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
};
