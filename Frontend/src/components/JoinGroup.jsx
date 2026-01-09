import Input from "./ui/Input";
import useInput from "./../hooks/useInput";
import Button from "./ui/Button";
import { ArrowRight, User, UserPlus } from "lucide-react";
import { useFetcher } from "react-router-dom";
import { useEffect } from "react";

function JoinGroup({ onSuccess }) {
  const {
    value: groupId,
    handleChange: handleGroupIdChange,
    handleBlur: handleGroupIdBlur,
    error: groupIdError,
  } = useInput("");

  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      onSuccess();
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post" action="/join" className="space-y-6">
      <Input
        id="groupId"
        type="text"
        name="groupId"
        label="Group id"
        icon={<UserPlus />}
        value={groupId}
        error={groupIdError}
        onChange={handleGroupIdChange}
        onBlur={handleGroupIdBlur}
        info={"Ask the group owner for the Group ID to join"}
      />
      <Button
        type="submit"
        className="bg-primary mt-6 w-full border-none text-white disabled:opacity-50"
      >
        <p>{fetcher.state === "submitting" ? "Joining..." : "Join Group"}</p>
        <ArrowRight size={15} />
      </Button>
    </fetcher.Form>
  );
}

export default JoinGroup;

export async function action({ request }) {
  const data = await request.formData();

  console.log(data.get("groupId"));

  return data;
}
