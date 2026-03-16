import { Receipt, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

function RecentBillItem({ bill }) {
  const { title, created_at, total_amount, balance } = bill;

  const statusStyles = {
    owed: {
      container: "bg-destructive/10 text-destructive",
      text: "text-destructive",
      label: "you owe",
    },
    owed_to_you: {
      container: "bg-primary/10 text-primary",
      text: "text-primary",
      label: "you are owed",
    },
    settled: {
      container: "bg-muted text-muted-foreground",
      text: "text-muted-foreground",
      label: "All settled",
    },
  };

  const styles =
    statusStyles[
      balance > 0 ? "owed_to_you" : balance < 0 ? "owed" : "settled"
    ];

  return (
    <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={`/groups/${bill.group_id}/bill/${bill.id}/review`}
        className="hover:bg-muted/40 flex cursor-pointer items-center justify-between rounded-lg px-5 py-3 transition"
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-3 ${styles.container}`}>
            {balance === 0 ? (
              <CheckCircle className="size-5" />
            ) : (
              <Receipt className="size-5" />
            )}
          </div>

          <div>
            <p className="text-foreground font-semibold md:text-lg">{title}</p>
            <p className="text-muted-foreground text-sm md:text-base">
              {new Date(created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="text-right">
          {balance === 0 ? (
            <>
              <p className="text-foreground font-semibold md:text-lg">
                Settled
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                Total: ${total_amount.toFixed(2)}
              </p>
            </>
          ) : (
            <>
              <p className={`font-semibold ${styles.text} md:text-lg`}>
                {balance < 0 ? "-" : "+"}${Math.abs(balance).toFixed(2)}
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                {styles.label}
              </p>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default RecentBillItem;
