import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import GroupPageHeader from "../components/Group/GroupPageHeader";
import GroupPageBillItem from "../components/Group/GroupPageBillItem";
import { Plus, Receipt } from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import NothingYet from "./../components/ui/NothingYet";
import BackdropLoader from "../utils/BackdropLoader";
import { apiFetch } from "./../utils/Fetch";

function GroupDetails() {
  const { groupDetails } = useLoaderData();

  return (
    <Suspense fallback={<BackdropLoader />}>
      <Await resolve={groupDetails}>
        {(data) => {
          const { name, members_count, bills_count, balance, bills } = data;

          return (
            <div className="flex flex-col gap-10">
              <GroupPageHeader
                name={name}
                members={members_count}
                bill={bills_count}
                balance={balance}
              />

              <section>
                <div className="mb-5 flex justify-between">
                  <div className="text-foreground flex items-center gap-2">
                    <Receipt />
                    <p className="text-lg font-bold md:text-xl">Bills</p>
                  </div>

                  <Link to="/scan">
                    <Button className="bg-primary">
                      <Plus />
                      <p>Add Bill</p>
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {bills.map((item) => (
                    <GroupPageBillItem key={item.id} bill={item} />
                  ))}
                </div>
                {bills.length == 0 && (
                  <NothingYet
                    icon={Receipt}
                    heading={"No bills yet!"}
                    description={"Start adding bills"}
                  />
                )}
              </section>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

export default GroupDetails;

export async function loader({ params }) {
  const { groupId } = params;

  return {
    groupDetails: apiFetch(`/api/groups/${groupId}`, {
      method: "GET",
    }).then((res) => res.json()),
  };
}
