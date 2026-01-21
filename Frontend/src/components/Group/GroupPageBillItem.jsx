import {
  Calendar,
  Check,
  Clock,
  Receipt,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { formatDate } from "./../../utils/FormatDate";
import { UserContext } from "./../../context/UserContext";
import { useContext } from "react";

function GroupPageBillItem({ bill }) {
  const { user } = useContext(UserContext);

  return (
    <Link to={`/bill/${bill.id}/review`}>
      <div className="bg-card border-border text-card-foreground hover:bg-card/20 flex cursor-pointer justify-between rounded-t-xl border p-5 transition-colors">
        <div className="mt-2">
          <Receipt />
        </div>
        <div className="flex w-3/5 flex-col gap-1">
          <p className="font-bold md:text-xl">{bill.title}</p>
          <div className="text-muted-foreground flex items-center gap-2">
            <Calendar size={15} />
            <p>{formatDate(bill.created_at)}</p>
          </div>
          <p className="text-muted-foreground">
            by {bill.paid_by === user?.fullname ? "You" : bill.paid_by}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${bill.total_amount.toFixed(2)}</p>
          <div className="text-muted-foreground flex items-center gap-2">
            <Clock size={15} />
            <p>{bill.pending_count} pending</p>
          </div>
        </div>
      </div>
      <div
        className={`border-border relative overflow-hidden rounded-b-xl border px-4 py-2 ${
          bill.user_balance < 0
            ? "bg-destructive/20"
            : bill.user_balance == 0
              ? "bg-transparent"
              : "bg-primary/20"
        }`}
      >
        {bill.user_balance !== 0 && (
          <motion.div
            className={`absolute top-0 right-4/5 bottom-0 left-0 blur-xl ${
              bill.user_balance < 0 ? "bg-destructive/40" : "bg-primary/40"
            }`}
            animate={{ x: ["0%", "400%"] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: [0.4, 0.2, 0.0, 1],
            }}
          />
        )}

        <div className="relative z-10 flex justify-between">
          <p className="text-muted-foreground font-bold">
            {bill.user_balance < 0
              ? "You Owe"
              : bill.user_balance === 0
                ? "Settled up"
                : "You are Owed"}
          </p>

          <div
            className={`flex items-center gap-2 font-bold ${
              bill.user_balance < 0
                ? "text-destructive"
                : bill.user_balance === 0
                  ? "text-foreground"
                  : "text-primary"
            }`}
          >
            {bill.user_balance < 0 ? (
              <TrendingDown size={16} />
            ) : bill.user_balance === 0 ? (
              <Check size={16} />
            ) : (
              <TrendingUp size={16} />
            )}
            <p>{bill.user_balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GroupPageBillItem;
