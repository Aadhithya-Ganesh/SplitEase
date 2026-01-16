import { EllipsisVertical, Receipt, Users } from "lucide-react";
import Button from "../ui/Button";

function GroupPageHeader({ name, members, bill, balance }) {
  return (
    <div className="bg-card border-border flex justify-between rounded-2xl border px-5 py-8">
      <div>
        <div className="text-card-foreground flex items-center gap-4">
          <p className="text-2xl font-bold md:text-3xl lg:text-4xl">{name}</p>
          <div className="hover:bg-accent w-fit cursor-pointer rounded-lg p-2 transition-colors">
            <EllipsisVertical size={18} />
          </div>
        </div>
        <div className="mt-4 flex gap-5 md:gap-10">
          <div className="text-muted-foreground flex items-center gap-2 md:text-lg">
            <Users />
            <p>{members} members</p>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 md:text-lg">
            <Receipt />
            <p>{bill} bills</p>
          </div>
        </div>
      </div>
      <div className="my-auto">
        <p className="text-muted-foreground text-right">
          {balance < 0 ? "You owe" : "You are owed"}
        </p>
        <p
          className={`text-right text-2xl font-bold ${balance < 0 ? "text-destructive" : "text-primary"}`}
        >
          ${balance}
        </p>
      </div>
    </div>
  );
}

export default GroupPageHeader;
