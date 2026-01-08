import { motion } from "framer-motion";

function Button({ children, className, disabled = false, ...props }) {
  return (
    <motion.button
      disabled={disabled}
      className={`border-border flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-5 py-2 text-sm font-semibold transition-all ease-in hover:opacity-90 md:text-base ${className}`}
      whileHover={!disabled && { scale: 1.05 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
