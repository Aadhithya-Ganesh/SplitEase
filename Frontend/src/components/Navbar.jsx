import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { ArrowRight } from "lucide-react";
import Button from "./ui/Button.jsx";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import Navigation from "./../components/Navigation.jsx";
import { User, Settings, LogOut } from "lucide-react";
import { useState, useRef } from "react";
import DropdownMenu from "./ui/DropdownMenu";
import DropdownItem from "./ui/DropdownItem";

function Navbar({ mode }) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <>
      {mode === "landing" && (
        <div className="bg-background border-border sticky top-0 flex w-full items-center justify-between border-b p-5">
          <Logo mode="landing" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden md:block">
              <Button className="bg-secondary text-foreground hover:bg-accent hover:text-background w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary border-none">
                <p>Start</p>
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      )}
      {mode !== "landing" && (
        <div className="bg-background border-border sticky top-0 z-100 flex w-full items-center justify-between border-b p-5">
          <div>
            <Logo mode="home" />
          </div>
          <div>
            <Navigation />
          </div>

          <div className="flex items-center gap-2">
            {/* Username (desktop only) */}

            <ThemeToggle />

            {/* User menu */}
            <div className="relative">
              <button
                ref={triggerRef}
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="hover:bg-accent text-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
              >
                <User size={20} />
              </button>

              <DropdownMenu
                open={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
                triggerRef={triggerRef}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                      {user?.fullname?.[0]?.toUpperCase()}
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {user?.fullname}
                      </p>
                      <p className="text-muted-foreground text-xs">Account</p>
                    </div>
                  </div>
                </div>

                <div className="border-border border-t" />
                <DropdownItem
                  icon={Settings}
                  label="Settings"
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate("/settings");
                  }}
                />

                <div className="border-border my-1 border-t" />

                <DropdownItem
                  icon={LogOut}
                  label="Logout"
                  danger
                  onClick={() => {
                    localStorage.removeItem("token");
                    setUser(null);
                    setUserMenuOpen(false);
                    navigate("/");
                  }}
                />
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
