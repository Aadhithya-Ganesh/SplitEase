import { Sparkles, ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

function HomePageHeader() {
  return (
    <header className="bg-background py-10 md:py-15">
      <div className="text-primary bg-primary/10 m-auto flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold">
        <Sparkles size={15} />
        <p>AI-Powered Bill Scanning</p>
      </div>
      <div className="mt-5 flex flex-col gap-6">
        <p className="text-foreground m-auto w-2/3 text-center text-4xl leading-tight font-bold sm:w-3/5 sm:text-5xl md:text-6xl lg:max-w-200">
          Split Bills <span className="text-primary">Effortlessly</span> with
          Friends & Family
        </p>
        <p className="text-muted-foreground m-auto w-2/3 text-center sm:text-lg md:w-2/5 md:text-xl">
          Scan receipts, split expenses fairly, and track who owes what. No more
          awkward money conversations.
        </p>
        <div className="m-auto flex w-2/3 flex-col justify-center gap-4 sm:flex-row md:w-3/5">
          <Link to="/signup">
            <Button className="bg-primary text-secondary w-full border-none">
              <p>Get Started</p>
              <ArrowRight />
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-secondary text-foreground hover:bg-accent hover:text-background w-full">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HomePageHeader;
