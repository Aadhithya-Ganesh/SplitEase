import Input from "./ui/Input";
import useInput from "./../hooks/useInput";
import Button from "./ui/Button";
import { ArrowRight, Plus, RefreshCcw } from "lucide-react";
import { useFetcher } from "react-router-dom";
import { useEffect } from "react";
import BackdropLoader from "./../utils/BackdropLoader";
import { apiFetch } from "./../utils/Fetch";
import { toast } from "sonner";

function UpdateGroup({ billId, onSuccess }) {
  const { value: groupName, handleChange, handleBlur, error } = useInput("");

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      onSuccess();
    }
  }, [fetcher.data, onSuccess]);

  return (
    <fetcher.Form
      method="put"
      action={`/bills/${billId}/update`}
      className="space-y-6"
    >
      <Input
        id="billName"
        name="billName"
        label="Bill Name"
        value={groupName}
        icon={<RefreshCcw />}
        error={error}
        onChange={handleChange}
        onBlur={handleBlur}
        info="Update bill name"
      />

      <Button
        type="submit"
        className="bg-primary w-full"
        disabled={fetcher.state === "submitting"}
      >
        <p>{fetcher.state === "submitting" ? "Updating..." : "Update Bill"}</p>
        <ArrowRight size={15} />
      </Button>

      {fetcher.state === "submitting" && <BackdropLoader />}
    </fetcher.Form>
  );
}

export default UpdateGroup;

export async function action({ request, params }) {
  const data = await request.formData();
  const billName = data.get("billName");

  await apiFetch(`/api/bills/${params.billId}/update`, {
    method: "PUT",
    body: {
      title: billName,
    },
  });

  toast.success("Updated Successfully");

  return { success: true };
}
