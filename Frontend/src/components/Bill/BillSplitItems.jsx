import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Select from "./../ui/Select";
import SplitParticipantsList from "./SplitParticipantList";

function BillSplitItems({ item, users, enabled, onUpdate }) {
  const [details, setDetails] = useState(false);
  const [splitMode, setSplitMode] = useState(item.split_mode);
  const lastPayload = useRef(null);

  // 🔒 local working copy
  const [participants, setParticipants] = useState([]);

  /**
   * INIT FROM ITEM
   */
  useEffect(() => {
    setParticipants(
      item.participants.map((p) => ({
        ...p,
        selected: p.percentage > 0,
      })),
    );
  }, [item.id]);

  /**
   * MEMOS
   */
  const selected = useMemo(
    () => participants.filter((p) => p.selected),
    [participants],
  );

  const selectedCount = selected.length;

  const selectedIds = useMemo(
    () => selected.map((p) => p.user_id).join(","),
    [selected],
  );

  /**
   * 🚨 HARD RULE:
   * Deselected users MUST have 0%
   */
  useEffect(() => {
    setParticipants((prev) =>
      prev.map((p) => (p.selected ? p : { ...p, percentage: 0 })),
    );
  }, [selectedIds]);

  /**
   * ⚖️ EQUAL SPLIT — WHOLE NUMBERS ONLY
   */
  useEffect(() => {
    if (splitMode !== "equal") return;
    if (!selectedCount) return;

    const base = Math.floor(100 / selectedCount);
    const remainder = 100 - base * selectedCount;

    setParticipants((prev) => {
      let extra = remainder;

      return prev.map((p) => {
        if (!p.selected) return p;

        const add = extra > 0 ? 1 : 0;
        if (extra > 0) extra--;

        return {
          ...p,
          percentage: base + add,
        };
      });
    });
  }, [splitMode, selectedIds, selectedCount]);

  /**
   * ⚖️ PERCENTAGE MODE — AUTO-FILL ONLY IF EMPTY
   */
  useEffect(() => {
    if (splitMode !== "percentage") return;
    if (!selectedCount) return;

    const total = selected.reduce((sum, p) => sum + p.percentage, 0);
    if (total > 0) return; // respect user edits

    const base = Math.floor(100 / selectedCount);
    const remainder = 100 - base * selectedCount;

    setParticipants((prev) => {
      let extra = remainder;

      return prev.map((p) => {
        if (!p.selected) return p;

        const add = extra > 0 ? 1 : 0;
        if (extra > 0) extra--;

        return {
          ...p,
          percentage: base + add,
        };
      });
    });
  }, [splitMode, selectedIds, selectedCount]);

  /**
   * ⬆️ SYNC UP
   */
  const payload = useMemo(
    () => ({
      ...item,
      split_mode: splitMode,
      participants: participants.map(({ selected, ...p }) => p),
    }),
    [participants, splitMode, item],
  );

  useEffect(() => {
    const serialized = JSON.stringify(payload);
    if (lastPayload.current === serialized) return;

    lastPayload.current = serialized;
    onUpdate(payload);
  }, [payload, onUpdate]);

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
            ${item.price.toFixed(2)} × {item.quantity}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Total</p>
            <p className="text-primary font-bold">${item.total.toFixed(2)}</p>
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

      {/* DETAILS */}
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
