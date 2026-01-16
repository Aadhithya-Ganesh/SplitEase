import { Form, Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { ArrowRight } from "lucide-react";
import Button from "./ui/Button.jsx";
import { PanelLeft, LogOut } from "lucide-react";
import { SidebarContext } from "../context/SidebarContext.jsx";
import { useContext } from "react";

function Navbar({ mode }) {
  const { isSideBar, setIsSideBar } = useContext(SidebarContext);
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
        <div className="bg-background border-border sticky top-0 flex w-full items-center justify-between border-b p-5">
          <div className="md:hidden">
            <Logo mode="home" />
          </div>
          <div className="text-foreground hover:bg-accent hidden cursor-pointer rounded-lg p-2 transition-colors md:block">
            <PanelLeft
              size={20}
              onClick={() => {
                setIsSideBar(!isSideBar);
              }}
            />
          </div>
          <div className="flex items-center md:gap-2">
            {/* username here */}
            <p className="text-muted-foreground hidden md:block">hateios</p>
            <ThemeToggle />
            <Form action="/logout" method="post">
              <button type="submit">
                <div className="text-foreground hover:bg-accent hidden cursor-pointer rounded-lg p-2 transition-colors md:block">
                  <LogOut size={20} />
                </div>
              </button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
