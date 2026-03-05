import Button from "./../components/ui/Button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useLoaderData, Link, Await, useParams } from "react-router-dom";
import BillDetailsSplitSummary from "../components/Bill/BillDetailsSplitSummary";
import BillDetailsItemsList from "../components/Bill/BillDetailsItemList";
import { Suspense, useContext, useState } from "react";
import BackdropLoader from "../utils/BackdropLoader";
import { UserContext } from "../context/UserContext";
import { apiFetch } from "../utils/Fetch";

function BillDetails() {
  const { user } = useContext(UserContext);
  const { groupId } = useParams();
  const { billDetails } = useLoaderData();

  return (
    <div className="flex flex-col gap-5">
      <Link to={`/groups/${groupId}`} className="w-fit">
        <Button className="text-foreground hover:bg-accent w-fit py-4">
          <MoveLeft />
          <p>Back to Group</p>
        </Button>
      </Link>

      <Suspense fallback={<BackdropLoader />}>
        <Await resolve={billDetails}>
          {(resolvedBills) => {
            // ✅ initialize state ONLY after data exists
            const [itemsList, setItemsList] = useState(resolvedBills.items);
            const [membersList, setMembersList] = useState(
              resolvedBills.members,
            );

            return (
              <>
                <div className="my-6">
                  <div className="text-foreground flex items-center justify-between">
                    <p className="text-2xl font-bold md:text-4xl">
                      {resolvedBills.title}
                    </p>
                    <div className="text-right font-semibold md:text-xl">
                      <p className="text-muted-foreground">Paid by</p>
                      <p>
                        {resolvedBills.paid_by.id === user?.id
                          ? "You"
                          : resolvedBills.paid_by.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-lg md:text-xl">
                    Review items and manage settlements
                  </p>
                </div>

                <BillDetailsSplitSummary
                  members={membersList}
                  setMembersList={setMembersList}
                  items={itemsList}
                  payee={resolvedBills.paid_by}
                />

                <BillDetailsItemsList
                  items={itemsList}
                  members={membersList}
                  setItemsList={setItemsList}
                />

                <div className="flex w-full items-center gap-7">
                  <Link
                    to={`/groups/${groupId}/bill/${resolvedBills.id}/split`}
                    className="w-full"
                  >
                    {user?.id === resolvedBills.paid_by.id && (
                      <Button className="bg-primary w-full py-4">
                        <p>Split Bill</p>
                        <MoveRight size={18} />
                      </Button>
                    )}
                  </Link>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export default BillDetails;

export async function loader({ params }) {
  const { billId } = params;

  return {
    billDetails: apiFetch(`/api/bills/${billId}/review`, {
      method: "GET",
    }).then((res) => res.json()),
  };
}
