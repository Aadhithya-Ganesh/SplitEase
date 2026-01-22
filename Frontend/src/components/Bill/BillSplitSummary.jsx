import { useMemo } from "react";
import Button from "../ui/Button";
import { Users } from "lucide-react";

function BillSplitSummary({ items, users }) {
  /**
   * Build per-user totals from itemized percentages
   */
  const summary = useMemo(() => {
    const totals = {};

    // Initialize users
    users.forEach((u) => {
      totals[u.id] = {
        ...u,
        amount: 0,
      };
    });

    // Aggregate amounts
    items.forEach((item) => {
      item.participants.forEach((p) => {
        if (!totals[p.user_id]) return;

        totals[p.user_id].amount += item.total * (p.percentage / 100);
      });
    });

    // Round to 2 decimals
    Object.values(totals).forEach((u) => {
      u.amount = Number(u.amount.toFixed(2));
    });

    return Object.values(totals);
  }, [items, users]);

  const grandTotal = useMemo(
    () => summary.reduce((sum, u) => sum + u.amount, 0).toFixed(2),
    [summary],
  );

  return (
    <div className="bg-card border-border flex flex-col gap-5 rounded-xl border p-6">
      <div className="text-foreground flex items-center gap-3">
        <Users size={18} />
        <p className="text-lg font-bold">Split Summary</p>
      </div>

      <ul className="flex flex-col gap-4">
        {summary.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full text-sm font-bold">
                {user.name[0]}
              </div>
              <p className="text-foreground font-medium">{user.name}</p>
            </div>

            <p className="text-foreground font-semibold">
              ${user.amount.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      <div className="border-border flex items-center justify-between border-t pt-4">
        <p className="text-muted-foreground font-medium">Total</p>
        <p className="text-primary text-lg font-bold">${grandTotal}</p>
      </div>

      <Button className="bg-primary mt-2 w-full">Save Split</Button>
    </div>
  );
}

export default BillSplitSummary;
