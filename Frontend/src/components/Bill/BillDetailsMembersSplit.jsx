import { CircleCheck, Clock } from "lucide-react";
import CustomCheckbox from "./../ui/CustomCheckbox";

function BillDetailsMembersSplit({ members, payee, setMembers, isUserPayee }) {
  const user = "Aadhithya Ganesh";

  function toggleSettled(id) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pending: !m.pending } : m)),
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {members.map((member) => (
        <li
          key={member.id}
          className="bg-muted/30 flex items-center gap-5 rounded-xl p-3"
        >
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
            {member.name[0]}
          </div>

          <div className="flex-1">
            <p className="text-foreground font-bold">
              {member.name === user ? "You" : member.name}
            </p>
            <p className="text-muted-foreground">${member.split.toFixed(2)}</p>
          </div>

          {/* PAYEE LABEL */}
          {member.payee && (
            <div className="text-primary flex items-center gap-1">
              <CircleCheck size={18} />
              <p>Payee</p>
            </div>
          )}

          {/* CHECKBOX ONLY IF YOU ARE PAYEE & NOT YOURSELF */}
          {isUserPayee && !member.payee && (
            <CustomCheckbox
              checked={!member.pending}
              onChange={() => toggleSettled(member.id)}
              label={member.pending ? "Mark as settled" : "Settled"}
            />
          )}

          {/* STATUS IF YOU ARE NOT PAYEE */}
          {!isUserPayee && !member.payee && (
            <div
              className={`${member.pending ? "text-muted-foreground" : "text-primary"} flex items-center gap-1`}
            >
              {member.pending ? <Clock size={18} /> : <CircleCheck size={18} />}
              <p>{member.pending ? "Pending" : "Settled"}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default BillDetailsMembersSplit;
