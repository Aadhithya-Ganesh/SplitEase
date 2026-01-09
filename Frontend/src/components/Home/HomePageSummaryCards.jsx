import { motion } from "motion/react";

function HomePageSummaryCards({ icon, heading, children }) {
  return (
    <motion.div
      className="bg-card text-card-foreground border-border rounded-xl border p-5"
      whileHover={{ y: -5 }}
    >
      {/* div for the icon and paragraph - flex */}
      <div className="mb-4 flex items-center gap-3">
        {/* div for the icon */}
        {icon}
        <p className="text-muted-foreground text-sm">{heading}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </motion.div>
  );
}

export default HomePageSummaryCards;
