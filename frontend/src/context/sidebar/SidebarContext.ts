import { createContext } from "react";

export interface SidebarContextType {
  isSidebarOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

export const getInitialSidebarState = (): boolean => {
  const storeValue = localStorage.getItem("sidebarOpen");
  return storeValue ? JSON.parse(storeValue) : true;
};
