import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Select from "./../ui/Select";
import SplitParticipantsList from "./SplitParticipantList";

function BillSplitItems({ item, users, enabled, onUpdate }) {
  const [details, setDetails] = useState(false);
  const [splitMode, setSplitMode] = useState("equal");

  // 🔒 local working copy (KEEP)
  const [participants, setParticipants] = useState(
    item.participants.map((p) => ({
      ...p,
      selected: p.percentage > 0,
    })),
  );

  const selectedCount = useMemo(
    () => participants.filter((p) => p.selected).length,
    [participants],
  );

  const perPerson =
    splitMode === "equal" && selectedCount > 0 ? item.total / selectedCount : 0;

  /**
   * 🔁 REDISTRIBUTE percentages (ALWAYS TOTAL = 100)
   */
  useEffect(() => {
    if (splitMode !== "percentage") return;

    const selected = participants.filter((p) => p.selected);
    if (!selected.length) return;

    const equal = +(100 / selected.length).toFixed(2);

    setParticipants((prev) =>
      prev.map((p) =>
        p.selected ? { ...p, percentage: equal } : { ...p, percentage: 0 },
      ),
    );
  }, [
    splitMode,
    participants.map((p) => p.selected).join(","), // ✅ intentional
  ]);

  /**
   * ⬆️ SYNC UP
   */
  useEffect(() => {
    onUpdate({
      ...item,
      split_mode: splitMode,
      participants: participants.map(({ selected, ...p }) => p),
    });
  }, [participants, splitMode]);

  return (
    <motion.li layout className="bg-card border-border rounded-xl border">
      {/* HEADER */}
      <div
        className={`flex items-center justify-between p-5 ${
          !enabled && "hover:bg-background cursor-pointer"
        }`}
        onClick={() => !enabled && setDetails((v) => !v)}
      >
        <div>
          <p className="text-card-foreground text-lg font-bold">{item.name}</p>
          <p className="text-muted-foreground text-sm">
            ${item.total.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* GREEN PRICE */}
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Per person</p>
            <p className="text-primary font-bold">${perPerson.toFixed(2)}</p>
          </div>

          {!enabled && (
            <motion.div
              animate={{ rotate: details ? 180 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="hover:bg-accent text-accent-foreground rounded-2xl p-2"
            >
              <ChevronDown />
            </motion.div>
          )}
        </div>
      </div>

      {/* DETAILS (⚠️ single motion wrapper – NO FLASH) */}
      <AnimatePresence initial={false}>
        {!enabled && details && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-border bg-card overflow-hidden border-t"
          >
            <div className="p-5">
              {/* SPLIT MODE */}
              <div className="mb-5 flex items-center gap-5">
                <p className="text-muted-foreground text-sm">Split Mode</p>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default BillSplitItems;
