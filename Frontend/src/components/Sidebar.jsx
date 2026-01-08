import { motion } from "motion/react";
import { useMediaQuery } from "react-responsive";
import Logo from "./Logo";
import { NavLink } from "react-router-dom";

function Sidebar({ navlist }) {
  const isLg = useMediaQuery({ minWidth: 1024 });
  const isMd = useMediaQuery({ minWidth: 768 });

  const sidebarWidth = isLg ? 320 : isMd ? 256 : 0;

  return (
    <motion.div
      initial={{ width: sidebarWidth }}
      animate={{ width: sidebarWidth }}
      exit={{ width: 0 }}
      className="bg-sidebar-background border-r-border sticky top-0 hidden h-screen shrink-0 flex-col border md:flex"
    >
      <div className="border-sidebar-border border-b p-5">
        <Logo />
      </div>
      <ul className="px-2 py-5 text-xs">
        <p className="text-muted-foreground px-2 py-3 font-semibold">
          Navigation
        </p>
        <div className="flex flex-col gap-2">
          {navlist.map((item, index) => {
            return (
              <NavLink
                to={`/${item.page.toLowerCase()}`}
                key={index}
                className={({ isActive }) =>
                  `mx-2 rounded-lg p-2 ${
                    isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                  }`
                }
              >
                <li className="text-sidebar-foreground flex items-center gap-3">
                  <item.icon size={20} />
                  <p className="font-bold">{item.page}</p>
                </li>
              </NavLink>
            );
          })}
        </div>
      </ul>
    </motion.div>
  );
}

export default Sidebar;
