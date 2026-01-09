import Input from "./ui/Input";
import useInput from "./../hooks/useInput";
import Button from "./ui/Button";
import { ArrowRight, Plus } from "lucide-react";
import { useFetcher } from "react-router-dom";
import { useEffect } from "react";

function CreateGroup({ onSuccess }) {
  const {
    value: groupName,
    handleChange: handleGroupNameChange,
    handleBlur: handleGroupNameBlur,
    error: groupNameError,
  } = useInput("");

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      onSuccess();
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post" action="/create" className="space-y-6">
      <Input
        id="groupName"
        type="text"
        name="groupName"
        label="Group Name"
        value={groupName}
        icon={<Plus />}
        error={groupNameError}
        onChange={handleGroupNameChange}
        onBlur={handleGroupNameBlur}
        info={"Set a name for your Group"}
      />
      <Button
        type="submit"
        className="bg-primary mt-6 w-full border-none text-white disabled:opacity-50"
      >
        <p>Create Group</p>
        <ArrowRight size={15} />
      </Button>
    </fetcher.Form>
  );
}

export default CreateGroup;

export async function action({ request }) {
  const data = await request.formData();

  console.log(data);

  return data;
}
