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
          <Receipt size={18} className="text-background" />
        </motion.div>
        <p className="text-foreground text-xl font-bold">SplitEase</p>
      </div>
    </Link>
  );
}

export default Logo;
