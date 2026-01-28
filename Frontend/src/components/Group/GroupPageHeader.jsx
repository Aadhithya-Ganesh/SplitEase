import { Receipt, Users, Copy, Trash, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../ui/Modal";
import UpdateGroup from "./../UpdateGroup";
import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "../../utils/Fetch";

function GroupPageHeader({ name, members, bill, balance }) {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [updateGroupModal, setUpdateGroupModal] = useState(false);

  const updateGroupOnSuccess = () => {
    setUpdateGroupModal(false);
  };

  const handleDelete = async () => {
    const response = await apiFetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete");
    }

    toast.success("Deleted Successfully");

    return navigate("/groups");
  };

  return (
    <div className="bg-card border-border relative flex justify-between rounded-2xl border px-5 py-8">
      {/* LEFT */}
      <div className="flex flex-col gap-3">
        {/* Title + Actions */}
        <div className="flex items-center gap-4">
          <p className="text-card-foreground text-2xl font-bold md:text-3xl">
            {name}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setUpdateGroupModal(true)}
              className="hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg p-2 transition"
              title="Edit group"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(groupId)}
              className="hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg p-2 transition"
              title="Copy group ID"
            >
              <Copy
                size={16}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(groupId);
                    toast.success("Group ID copied!");
                  } catch (err) {
                    console.error("Failed to copy", err);
                  }
                }}
              />
            </button>

            <button
              className="hover:bg-destructive/10 text-destructive rounded-lg p-2 transition"
              title="Delete group"
              onClick={handleDelete}
            >
              <Trash size={16} />
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="text-muted-foreground flex gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{members} members</span>
          </div>
          <div className="flex items-center gap-2">
            <Receipt size={16} />
            <span>{bill} bills</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="my-auto text-right">
        <p className="text-muted-foreground">
          {balance < 0 ? "You owe" : "You are owed"}
        </p>
        <p
          className={`text-2xl font-bold ${
            balance < 0 ? "text-destructive" : "text-primary"
          }`}
        >
          ${Math.abs(balance).toFixed(2)}
        </p>
      </div>
      <Modal
        open={updateGroupModal}
        onClose={() => setUpdateGroupModal(false)}
        heading="Edit Group Name"
      >
        <UpdateGroup groupId={groupId} onSuccess={updateGroupOnSuccess} />
      </Modal>
    </div>
  );
}

export default GroupPageHeader;
