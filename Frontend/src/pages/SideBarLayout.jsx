import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "../components/Navbar";
import { ChartColumn, Home, Settings } from "lucide-react";
import { useMediaQuery } from "react-responsive";

function SidebarLayout() {
  const { isSideBar } = useContext(SidebarContext);
  const isLg = useMediaQuery({ minWidth: 1024 });
  const isMd = useMediaQuery({ minWidth: 768 });

  const sidebarWidth = isLg ? 320 : isMd ? 256 : 0;

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
      <AnimatePresence initial={false} mode="sync">
        {isSideBar && (
          <motion.div
            layout
            initial={{ width: 0 }}
            animate={{ width: sidebarWidth }}
            exit={{ width: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="hidden md:block md:w-1/3 lg:w-1/4"
          >
            <Sidebar navlist={navlist} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="bg-background flex flex-1 flex-col"
      >
        <Navbar mode="home" />
        <div className="grow">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}

export default SidebarLayout;
