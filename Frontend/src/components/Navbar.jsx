import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { ArrowRight } from "lucide-react";
import Button from "./ui/Button.jsx";

function Navbar({ mode }) {
  return (
    <div className="bg-background border-border sticky top-0 flex w-full items-center justify-between border-b p-5">
      <Logo />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link to="/signup">
          <Button className="bg-primary border-none">
            <p className="text-sm">Start</p>
            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
