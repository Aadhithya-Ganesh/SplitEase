import { useMemo } from "react";
import { User } from "lucide-react";
import BillDetailsMembersSplit from "./BillDetailsMembersSplit";
import { useOutletContext } from "react-router-dom";

function BillDetailsSplitSummary({ items, members, payee, setMembersList }) {
  const { user } = useOutletContext();

  const isUserPayee = payee.id === user?.id;

  /**
   * ✅ DERIVE member amounts FROM ITEMS
   */
  const derivedMembers = useMemo(() => {
    const map = {};

    // initialize members
    members.forEach((m) => {
      map[m.id] = {
        ...m,
        amount: 0,
      };
    });

    // aggregate from items
    items.forEach((item) => {
      item.participants.forEach((p) => {
        if (!map[p.user_id]) return;

        map[p.user_id].amount +=
          item.quantity * item.price * (p.percentage / 100);
      });
    });

    // round
    return Object.values(map).map((m) => ({
      ...m,
      amount: Number(m.amount.toFixed(2)),
    }));
  }, [items, members]);

  /**
   * ✅ TOP BANNER AMOUNT
   */
  const amount = useMemo(() => {
    if (isUserPayee) {
      // others owe you
      return derivedMembers
        .filter((m) => !m.is_paid && m.id !== user?.id)
        .reduce((sum, m) => sum + m.amount, 0);
    }

    // you owe someone
    return derivedMembers.find((m) => m.id === user?.id)?.amount ?? 0;
  }, [derivedMembers, isUserPayee, user?.id]);

  const myMember = derivedMembers.find((m) => m.id === user?.id);
  const iHavePaid = myMember?.is_paid;

  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-xl border px-5 py-8">
      <div className="text-card-foreground flex items-center gap-2 font-bold">
        <User size={20} />
        <p className="text-lg md:text-xl">Split Summary</p>
      </div>

      {/* TOP SUMMARY */}
      <div
        className={`p-5 ${
          isUserPayee
            ? "text-primary border-primary/20 bg-primary/10"
            : iHavePaid
              ? "text-foreground border-foreground/20 bg-foreground/10"
              : "text-destructive border-destructive/20 bg-destructive/10"
        } rounded-xl border`}
      >
        <p className="text-muted-foreground">
          {isUserPayee ? "You Paid this Bill" : "Your Share"}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-xl font-bold">
            {isUserPayee
              ? "You are owed $"
              : iHavePaid
                ? "You owed $"
                : "You owe $"}
            {amount.toFixed(2)}
          </p>

          {!isUserPayee && (
            <p className="rounded-2xl px-3 py-1 text-sm">
              {iHavePaid ? "Settled" : "Pending"}
            </p>
          )}
        </div>
      </div>

      {/* MEMBERS LIST */}
      <BillDetailsMembersSplit
        members={derivedMembers}
        setMembers={setMembersList}
        payee={payee}
        isUserPayee={isUserPayee}
      />
    </div>
  );
}

export default BillDetailsSplitSummary;
