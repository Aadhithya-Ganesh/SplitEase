import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { AnimatePresence } from "motion/react";
import Navbar from "../components/Navbar";
import { ChartColumn, Home, Settings } from "lucide-react";

function SidebarLayout() {
  const { isSideBar } = useContext(SidebarContext);

  const navlist = [
    {
      icon: Home,
      page: "Home",
    },
    {
      icon: ChartColumn,
      page: "Analytics",
    },
    {
      icon: Settings,
      page: "Settings",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <AnimatePresence>
        {isSideBar && <Sidebar navlist={navlist} />}
      </AnimatePresence>
      <div className="bg-background flex flex-1 flex-col">
        <Navbar mode="home" />
        <div className="grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SidebarLayout;
