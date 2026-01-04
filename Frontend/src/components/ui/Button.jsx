import { motion } from "framer-motion";

function Button({ children, className, ...props }) {
  return (
    <motion.button
      className={`border-border flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 py-2 font-semibold transition-all ease-in hover:opacity-90 ${className}`}
      {...props}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
