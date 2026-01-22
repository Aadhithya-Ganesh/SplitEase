import CustomCheckbox from "../ui/CustomCheckbox";

function SplitParticipantsList({ users, participants, splitMode, onChange }) {
  function toggleUser(userId) {
    onChange((prev) =>
      prev.map((p) =>
        p.user_id === userId
          ? { ...p, percentage: p.percentage > 0 ? 0 : 1 }
          : p,
      ),
    );
  }

  function updatePercentage(userId, value) {
    onChange((prev) =>
      prev.map((p) =>
        p.user_id === userId ? { ...p, percentage: Number(value) } : p,
      ),
    );
  }

  const selected = participants.filter((p) => p.percentage > 0);

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">
        Members ({selected.length} selected)
      </p>

      {participants.map((p) => {
        const user = users.find((u) => u.id === p.user_id);
        const isSelected = p.percentage > 0;

        return (
          <div
            key={p.user_id}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${isSelected ? "border-primary/30 bg-primary/5" : "border-border"}`}
          >
            {/* Checkbox */}
            <CustomCheckbox
              checked={isSelected}
              onChange={() => toggleUser(p.user_id)}
              label={user.name}
            />

            {/* Percentage input */}
            {splitMode === "percentage" && isSelected && (
              <input
                type="number"
                min={0}
                max={100}
                value={p.percentage}
                onChange={(e) => updatePercentage(p.user_id, e.target.value)}
                className="bg-card text-foreground border-border ml-auto w-20 rounded-lg border px-2 py-1 text-right text-sm"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SplitParticipantsList;
