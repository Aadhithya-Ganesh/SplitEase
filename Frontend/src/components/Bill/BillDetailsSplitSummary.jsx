import { useState, useMemo, useContext } from "react";
import { User } from "lucide-react";
import BillDetailsMembersSplit from "./BillDetailsMembersSplit";
import { UserContext } from "../../context/UserContext";

function BillDetailsSplitSummary({ members, payee }) {
  const [memberList, setMemberList] = useState(members);
  const { user } = useContext(UserContext);

  const isUser = payee.id === user?.id;

  const amount = useMemo(() => {
    if (isUser) {
      // You paid → others still owe you
      return memberList
        .filter((m) => !m.is_paid && m.id !== user?.id)
        .reduce((sum, m) => sum + m.amount, 0);
    }

    // Someone else paid → your share (fixed value)
    return memberList.find((m) => m.id === user?.id)?.amount ?? 0;
  }, [memberList, isUser, user?.id]);

  const myMember = members.find((m) => m.id === user?.id);

  // for non-payee
  const iHavePaid = myMember?.is_paid;

  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-xl border px-5 py-8">
      <div className="text-card-foreground flex items-center gap-2 font-bold">
        <User size={20} />
        <p className="text-lg md:text-xl">Split Summary</p>
      </div>
      <div
        className={`p-5 ${isUser ? "text-primary border-primary/20 bg-primary/10" : iHavePaid ? "text-foreground border-foreground/20 bg-foreground/10" : "text-destructive border-destructive/20 bg-destructive/10"} rounded-xl border`}
      >
        <p className="text-muted-foreground">
          {isUser ? "You Paid this Bill" : "Your Share"}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xl font-bold">
            {isUser ? "You are owed $" : iHavePaid ? "You owed $" : "You owe $"}
            {amount.toFixed(2)}
          </p>

          {!isUser && (
            <p
              className={`rounded-2xl px-3 py-1 text-sm ${isUser ? "bg-primary/10" : iHavePaid ? "bg-foreground/10" : "bg-destructive/10"}`}
            >
              {iHavePaid ? "Settled" : "Pending"}
            </p>
          )}
        </div>
      </div>
      <BillDetailsMembersSplit
        members={memberList}
        payee={payee}
        setMembers={setMemberList}
        isUserPayee={isUser}
      />
    </div>
  );
}

export default BillDetailsSplitSummary;
