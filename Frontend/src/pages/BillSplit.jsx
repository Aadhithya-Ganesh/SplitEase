import { Link, useLoaderData, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { Divide, DollarSign, MoveLeft, Users } from "lucide-react";
import Switch from "./../components/ui/Switch";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BillSplitItems from "../components/Bill/BillSplitItems";
import BillSplitSummary from "../components/Bill/BillSplitSummary";

function BillSplit() {
  const { groupId, billId } = useParams();
  const [enabled, setEnabled] = useState(true);
  const data = useLoaderData();
  const [items, setItems] = useState(data.items);

  return (
    <div className="flex flex-col gap-8">
      <Link to={`/groups/${groupId}/bill/${billId}/review`}>
        <Button className="text-foreground hover:bg-accent w-fit py-4">
          <MoveLeft />
          <p>Back to Review</p>
        </Button>
      </Link>

      <div className="flex justify-between">
        <div className="flex items-center gap-3 font-bold">
          <Divide className="text-primary size-5 md:size-8" />
          <p className="text-foreground text-2xl md:text-3xl">Split Bill</p>
        </div>
        <p className="text-foreground text-2xl font-bold md:text-3xl">
          Movie Night
        </p>
      </div>
      <div className="bg-card border-border flex items-center justify-between gap-3 rounded-xl border p-6">
        <div className="bg-primary/10 text-primary w-fit rounded-lg p-3">
          <Users className="size-4 md:size-5" />
        </div>
        <div className="w-7/8">
          <p className="text-foreground text-sm font-bold md:text-base">
            Split Entire Bill Equally
          </p>
          <p className="text-muted-foreground text-sm md:text-base">
            All items split among all {data.members} members
          </p>
        </div>
        <Switch checked={enabled} onChange={setEnabled} size="md" />
      </div>
      <div>
        <AnimatePresence>
          {!enabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-foreground flex items-center gap-2 font-bold"
            >
              <DollarSign size={20} />
              <p className="text-lg">Customize Split per Item</p>
            </motion.div>
          )}
          <div className="mt-5 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            <motion.ul layout className="flex flex-col gap-5 lg:col-span-2">
              {items.map((item) => (
                <BillSplitItems
                  key={item.id}
                  item={item}
                  members={data.members}
                  users={data.users}
                  enabled={enabled}
                  onUpdate={(updatedItem) =>
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === updatedItem.id ? updatedItem : i,
                      ),
                    )
                  }
                />
              ))}
            </motion.ul>
            <div>
              <BillSplitSummary items={items} users={data.users} />
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BillSplit;

export async function loader({ params }) {
  const data = {
    bill_id: 1,
    payee_id: "user_1",
    members: 3,
    users: [
      { id: "user_1", name: "You" },
      { id: "user_2", name: "Alex Johnson" },
      { id: "user_3", name: "Sarah Miller" },
    ],
    items: [
      {
        id: "item_1",
        name: "Movie Tickets",
        quantity: 3,
        price: 45,
        total: 135,
        participants: [
          {
            user_id: "user_1",
            percentage: 33.33,
          },
          {
            user_id: "user_2",
            percentage: 33.33,
          },
          {
            user_id: "user_3",
            percentage: 33.33,
          },
        ],
      },
      {
        id: "item_2",
        name: "Popcorn & Drinks",
        quantity: 1,
        price: 25,
        total: 25,
        participants: [
          {
            user_id: "user_1",
            percentage: 33.33,
          },
          {
            user_id: "user_2",
            percentage: 33.33,
          },
          {
            user_id: "user_3",
            percentage: 33.33,
          },
        ],
      },
    ],
  };

  return data;
}
