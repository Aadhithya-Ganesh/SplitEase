import { Await, Link, useLoaderData, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { Divide, DollarSign, MoveLeft, Users } from "lucide-react";
import Switch from "./../components/ui/Switch";
import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BillSplitItems from "../components/Bill/BillSplitItems";
import BillSplitSummary from "../components/Bill/BillSplitSummary";
import { apiFetch } from "./../utils/Fetch";
import BackdropLoader from "../utils/BackdropLoader";

function BillSplit() {
  const { groupId, billId } = useParams();
  const { billDetails } = useLoaderData();

  function applyGlobalEqualSplit(items, users) {
    const count = users.length;
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;

    return items.map((item) => {
      let extra = remainder;

      return {
        ...item,
        split_mode: "equal",
        participants: users.map((u) => {
          const add = extra > 0 ? 1 : 0;
          if (extra > 0) extra--;

          return {
            user_id: u.id,
            percentage: base + add,
          };
        }),
      };
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <Link to={`/groups/${groupId}/bill/${billId}/review`} className="w-fit">
        <Button className="text-foreground hover:bg-accent w-fit py-4">
          <MoveLeft />
          <p>Back to Review</p>
        </Button>
      </Link>

      <Suspense fallback={<BackdropLoader />}>
        <Await resolve={billDetails}>
          {(data) => {
            const [items, setItems] = useState(data.items);
            const [enabled, setEnabled] = useState(() =>
              data.items.every((item) => item.split_mode === "equal"),
            );

            return (
              <>
                <div className="flex justify-between">
                  <div className="flex items-center gap-3 font-bold">
                    <Divide className="text-primary size-5 md:size-8" />
                    <p className="text-foreground text-2xl md:text-3xl">
                      Split Bill
                    </p>
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
                      All items split among all {data.members.length} members
                    </p>
                  </div>
                  <Switch
                    checked={enabled}
                    size="md"
                    onChange={(value) => {
                      setEnabled(value);

                      if (value) {
                        setItems((prev) =>
                          applyGlobalEqualSplit(prev, data.members),
                        );
                      }
                    }}
                  />
                </div>
                <div>
                  <AnimatePresence>
                    {!enabled && (
                      <motion.div
                        key="customize-header"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-foreground flex items-center gap-2 font-bold"
                      >
                        <DollarSign size={20} />
                        <p className="text-lg">Customize Split per Item</p>
                      </motion.div>
                    )}

                    <motion.div
                      key="bill-layout"
                      className="mt-5 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
                    >
                      <motion.ul
                        layout
                        className="flex flex-col gap-5 lg:col-span-2"
                      >
                        {items.map((item) => (
                          <BillSplitItems
                            key={item.id}
                            item={item}
                            users={data.members}
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
                        <BillSplitSummary items={items} users={data.members} />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export default BillSplit;

export async function loader({ params }) {
  const { billId } = params;

  return {
    billDetails: apiFetch(`/api/bills/${billId}/review`, {
      method: "GET",
    }).then((res) => res.json()),
  };
}
