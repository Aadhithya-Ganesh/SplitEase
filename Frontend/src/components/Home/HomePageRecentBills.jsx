import { Receipt } from "lucide-react";
import RecentBillItem from "./RecentBillItem";

function HomePageRecentBills({ bills }) {
  return (
    <div className="bg-card border-border mt-8 rounded-xl border p-5 md:p-10 lg:w-1/2">
      <div className="text-card-foreground flex items-center gap-2">
        <Receipt className="size-6" />
        <p className="text-lg font-semibold">Recent Bills</p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {bills.map((bill) => (
          <RecentBillItem bill={bill} />
        ))}
      </div>
    </div>
  );
}

export default HomePageRecentBills;
