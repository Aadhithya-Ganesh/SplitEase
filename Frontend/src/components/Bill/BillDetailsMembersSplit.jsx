import { CircleCheck, Clock } from "lucide-react";
import CustomCheckbox from "../ui/CustomCheckbox";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../utils/Fetch";

function BillDetailsMembersSplit({ members, setMembers, isUserPayee }) {
  const { user } = useContext(UserContext);
  const { billId } = useParams();

  async function toggleSettled(id) {
    // optimistic update on BASE members
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_paid: !m.is_paid } : m)),
    );

    const response = await apiFetch(`/api/bills/${billId}/payments/${id}`, {
      method: "PUT",
    });

    if (!response.ok) {
      // rollback
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_paid: !m.is_paid } : m)),
      );
    }
  }

  return (
    <ul className="flex flex-col gap-4">
      {members.map((member) => {
        const isYou = member.id === user?.id;
        const isPayee = member.role === "payer";
        const isSettled = member.is_paid;

        return (
          <li
            key={member.id}
            className="bg-muted/30 flex items-center gap-4 rounded-xl p-3"
          >
            {/* Avatar */}
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full font-semibold">
              {member.name[0]}
            </div>

            {/* Name & amount */}
            <div className="flex-1">
              <p className="text-foreground font-semibold">
                {isYou ? "You" : member.name}
              </p>
              <p className="text-muted-foreground text-sm">
                ${member.amount.toFixed(2)}
              </p>
            </div>

            {/* PAYEE BADGE */}
            {isPayee && (
              <div className="text-primary flex items-center gap-1 text-sm font-medium">
                <CircleCheck size={16} />
                Payee
              </div>
            )}

            {/* PAYEE CONTROLS (only for others) */}
            {isUserPayee && !isPayee && (
              <CustomCheckbox
                checked={isSettled}
                onChange={() => toggleSettled(member.id)}
                label={isSettled ? "Settled" : "Pending"}
              />
            )}

            {/* READ-ONLY STATUS (non-payee view) */}
            {!isUserPayee && !isPayee && (
              <div
                className={`flex items-center gap-1 text-sm ${
                  !isSettled ? "text-muted-foreground" : "text-primary"
                }`}
              >
                {isSettled ? <CircleCheck size={16} /> : <Clock size={16} />}
                <p>{isSettled ? "Settled" : "Pending"}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default BillDetailsMembersSplit;
