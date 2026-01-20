import Input from "./ui/Input";
import useInput from "./../hooks/useInput";
import Button from "./ui/Button";
import { ArrowRight, Plus, RefreshCcw } from "lucide-react";
import { useFetcher } from "react-router-dom";
import { useEffect } from "react";
import BackdropLoader from "./../utils/BackdropLoader";
import { apiFetch } from "./../utils/Fetch";
import { toast } from "sonner";

function UpdateGroup({ groupId, onSuccess }) {
  const { value: groupName, handleChange, handleBlur, error } = useInput("");

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      onSuccess();
    }
  }, [fetcher.data, onSuccess]);

  return (
    <fetcher.Form
      method="patch"
      action={`/groups/${groupId}/update`}
      className="space-y-6"
    >
      <Input
        id="groupName"
        name="groupName"
        label="Group Name"
        value={groupName}
        icon={<RefreshCcw />}
        error={error}
        onChange={handleChange}
        onBlur={handleBlur}
        info="Update group name"
      />

      <Button
        type="submit"
        className="bg-primary w-full"
        disabled={fetcher.state === "submitting"}
      >
        <p>{fetcher.state === "submitting" ? "Updating..." : "Update Group"}</p>
        <ArrowRight size={15} />
      </Button>

      {fetcher.state === "submitting" && <BackdropLoader />}
    </fetcher.Form>
  );
}

export default UpdateGroup;

export async function action({ request, params }) {
  const data = await request.formData();
  const groupName = data.get("groupName");

  await apiFetch(`/api/groups/${params.groupId}`, {
    method: "PUT",
    body: {
      name: groupName,
    },
  });

  toast.success("Updated Successfully");

  return { success: true };
}
