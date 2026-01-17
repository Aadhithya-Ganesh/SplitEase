import { CircleCheck } from "lucide-react";
import { motion } from "framer-motion";

function CustomCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      {/* Hidden real checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      {/* Custom UI */}
      <motion.div
        initial={false}
        animate={{
          backgroundColor: checked
            ? "rgb(34 197 94)" // green-500
            : "rgba(255,255,255,0.08)",
          borderColor: checked ? "rgb(34 197 94)" : "rgba(255,255,255,0.2)",
        }}
        className="flex h-6 w-6 items-center justify-center rounded-full border"
      >
        {checked && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CircleCheck size={16} className="text-black" />
          </motion.div>
        )}
      </motion.div>

      {/* Text */}
      <span
        className={`text-sm ${
          checked ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export default CustomCheckbox;
