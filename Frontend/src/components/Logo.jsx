import { Receipt } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Logo() {
  return (
    <Link to="/">
      <div className="flex w-fit items-center gap-2">
        <motion.div
          className="bg-primary rounded-lg p-2"
          whileHover={{ rotate: -10 }}
        >
          <Receipt className="text-background h-5 w-5 md:h-7 md:w-7" />
        </motion.div>
        <p className="text-foreground text-xl font-bold md:text-2xl">
          SplitEase
        </p>
      </div>
    </Link>
  );
}

export default Logo;
