import CustomCheckbox from "../ui/CustomCheckbox";

function SplitParticipantsList({ users, participants, splitMode, onChange }) {
  function toggleUser(userId) {
    onChange((prev) =>
      prev.map((p) =>
        p.user_id === userId ? { ...p, selected: !p.selected } : p,
      ),
    );
  }

  function updatePercentage(userId, value) {
    const num = Math.max(0, Math.min(100, Number(value) || 0));

    onChange((prev) =>
      prev.map((p) => (p.user_id === userId ? { ...p, percentage: num } : p)),
    );
  }

  const selected = participants.filter((p) => p.selected);
  const totalPercentage = selected.reduce((sum, p) => sum + p.percentage, 0);

  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">
        Members ({selected.length} selected)
      </p>

      {participants.map((p) => {
        const user = users.find((u) => u.id === p.user_id);
        const isSelected = p.selected;

        return (
          <div
            key={p.user_id}
            className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
              isSelected ? "border-primary/30 bg-primary/5" : "border-border"
            }`}
          >
            <CustomCheckbox
              checked={isSelected}
              onChange={() => toggleUser(p.user_id)}
              label={user.name}
            />

            {splitMode === "percentage" && isSelected && (
              <div className="ml-auto flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={p.percentage}
                  onChange={(e) => updatePercentage(p.user_id, e.target.value)}
                  className="bg-card text-foreground border-border w-20 rounded-lg border px-2 py-1 text-right text-sm"
                />
                <span className="text-muted-foreground text-sm">%</span>
              </div>
            )}
          </div>
        );
      })}

      {splitMode === "percentage" && (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${
            totalPercentage === 100
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          Total: {totalPercentage.toFixed(2)}%
        </div>
      )}
    </div>
  );
}

export default SplitParticipantsList;
