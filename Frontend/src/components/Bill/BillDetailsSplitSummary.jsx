import { useState, useMemo } from "react";
import { User } from "lucide-react";
import BillDetailsMembersSplit from "./BillDetailsMembersSplit";

function BillDetailsSplitSummary({ members, payee }) {
  const user = "Aadhithya Ganesh";
  const [memberList, setMemberList] = useState(members);

  const isUser = payee === user;

  const amount = useMemo(() => {
    if (isUser) {
      // You paid → others owe you
      return memberList
        .filter((m) => m.pending && m.name !== user)
        .reduce((sum, m) => sum + m.split, 0);
    }

    // Someone else paid → your share
    return memberList.find((m) => m.name === user)?.split ?? 0;
  }, [memberList, isUser]);

  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-xl border px-5 py-8">
      <div className="text-card-foreground flex items-center gap-2 font-bold">
        <User size={20} />
        <p className="text-lg md:text-xl">Split Summary</p>
      </div>
      <div
        className={`p-5 ${isUser ? "text-primary border-primary/20 bg-primary/10" : "text-destructive border-destructive/20 bg-destructive/10"} rounded-xl border`}
      >
        <p className="text-muted-foreground">
          {isUser ? "You Paid this Bill" : "Your Share"}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xl font-bold">
            {isUser && "You are owed "}${amount.toFixed(2)}
          </p>
          {!isUser && (
            <p
              className={`${isUser ? "bg-primary/10" : "bg-destructive/10"} rounded-2xl px-3 py-1 text-sm`}
            >
              pending
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
