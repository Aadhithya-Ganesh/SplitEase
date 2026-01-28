import { NavLink, useLocation, Link } from "react-router-dom";
import { BarChart3, Home, Plus, Settings, Users } from "lucide-react";

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/home", desktop: true },
    { icon: Users, label: "Groups", path: "/groups", desktop: true },
    { icon: Plus, label: "Add", path: "/scan", isAction: true },
    { icon: BarChart3, label: "Analytics", path: "/analytics", desktop: true },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      <ul className="text-muted-foreground hidden gap-2 md:flex">
        {navItems
          .filter((item) => item.desktop)
          .map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `mx-2 rounded-lg p-2 px-3 ${
                  isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
                }`
              }
            >
              <li className="text-muted-foreground flex items-center gap-3">
                <item.icon size={20} />
                <p className="font-bold">{item.label}</p>
              </li>
            </NavLink>
          ))}
      </ul>

      <nav className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 fixed right-0 bottom-0 left-0 z-100 border-t backdrop-blur md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const active = item.isGroups ? isGroupsActive : isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`${item.isAction && "relative"} flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors`}
              >
                {item.isAction ? (
                  <div className="bg-primary -mt-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                    <item.icon className="text-primary-foreground h-6 w-6" />
                  </div>
                ) : (
                  <>
                    <item.icon
                      className={`h-5 w-5 transition-colors ${active ? "text-primary" : "text-foreground"}`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default Navigation;
