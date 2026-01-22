import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import SplitParticipantsList from "./SplitParticipantList";
import Select from "./../ui/Select";

function BillSplitItems({ item, users, enabled, onUpdate }) {
  const [details, setDetails] = useState(false);
  const [splitMode, setSplitMode] = useState("equal");
  const [participants, setParticipants] = useState(item.participants);

  /* ---------------- EQUAL SPLIT LOGIC ---------------- */
  useEffect(() => {
    if (splitMode !== "equal") return;

    const selected = participants.filter((p) => p.percentage > 0);
    if (!selected.length) return;

    const equal = +(100 / selected.length).toFixed(2);

    setParticipants((prev) =>
      prev.map((p) => (p.percentage > 0 ? { ...p, percentage: equal } : p)),
    );
  }, [splitMode]);

  /* ---------------- SYNC UP ---------------- */
  useEffect(() => {
    onUpdate({
      ...item,
      participants,
    });
  }, [participants, splitMode]);

  return (
    <motion.li layout className={`bg-card border-border rounded-xl border`}>
      {/* HEADER */}
      <div
        className={`flex items-center justify-between p-5 ${
          !enabled && "hover:bg-background cursor-pointer"
        }`}
        onClick={() => !enabled && setDetails((v) => !v)}
      >
        <div className="w-3/5 sm:w-4/5">
          <p className="text-card-foreground text-lg font-bold">{item.name}</p>
          <p className="text-muted-foreground text-sm">
            ${item.total.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground text-right text-xs">Per person</p>
          <p className="text-primary text-right font-bold">
            $
            {(
              item.total /
                participants.filter((p) => p.percentage > 0).length || 0
            ).toFixed(2)}
          </p>
        </div>

        <AnimatePresence>
          {!enabled && (
            <motion.div
              animate={{ rotate: details ? 180 : 0 }}
              className="hover:bg-accent text-accent-foreground rounded-2xl p-2"
            >
              <ChevronDown />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAILS */}
      <AnimatePresence>
        {!enabled && details && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-border border-t p-5"
          >
            {/* SPLIT MODE */}
            <div className="mb-5 flex items-center gap-5">
              <p className="text-muted-foreground font-bold">Split Mode</p>

              <Select
                value={splitMode}
                onChange={setSplitMode}
                options={[
                  { label: "Equal", value: "equal" },
                  { label: "Percentage", value: "percentage" },
                ]}
                disabled={enabled}
                size="sm"
              />
            </div>

            {/* PARTICIPANTS */}
            <SplitParticipantsList
              users={users}
              participants={participants}
              splitMode={splitMode}
              onChange={setParticipants}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default BillSplitItems;
