import { SidebarContext } from "@/context/sidebar/SidebarContext";
import { useContext } from "react";

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
