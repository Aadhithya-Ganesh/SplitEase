import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

function RootPage() {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Outlet />
    </motion.div>
  );
}

export default RootPage;
