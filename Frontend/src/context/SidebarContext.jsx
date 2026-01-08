import { createContext, useState } from "react";

export const SidebarContext = createContext();

function SidebarContextProvider({ children }) {
  const [isSideBar, setIsSideBar] = useState(true);

  return (
    <SidebarContext.Provider value={{ isSideBar, setIsSideBar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarContextProvider;
