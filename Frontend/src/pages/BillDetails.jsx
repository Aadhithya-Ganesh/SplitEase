import Button from "./../components/ui/Button";
import { MoveLeft, MoveRight, Pencil, Trash } from "lucide-react";
import {
  useLoaderData,
  Link,
  Await,
  useParams,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import BillDetailsSplitSummary from "../components/Bill/BillDetailsSplitSummary";
import BillDetailsItemsList from "../components/Bill/BillDetailsItemList";
import { Suspense, useState } from "react";
import BackdropLoader from "../utils/BackdropLoader";
import { apiFetch } from "../utils/Fetch";
import { toast } from "sonner";
import Modal from "../components/ui/Modal";
import UpdateBill from "../components/UpdateBill";
import { motion } from "motion/react";

function BillDetails() {
  const { user } = useOutletContext();
  const { groupId, billId } = useParams();
  const { billDetails } = useLoaderData();

  const navigate = useNavigate();
  const [updateBillModal, setUpdateBillModal] = useState(false);

  const updateBillOnSuccess = () => {
    setUpdateBillModal(false);
  };

  const handleDelete = async () => {
    const response = await apiFetch(`/api/bills/${billId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete");
    }

    toast.success("Deleted Successfully");

    return navigate("/groups/" + groupId);
  };

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5"
              >
                <div className="my-6">
                  <div className="text-foreground flex items-center justify-between">
                    <div className="flex gap-4">
                      <p className="text-2xl font-bold md:text-4xl">
                        {resolvedBills.title}
                      </p>
                      {user.id === resolvedBills.paid_by.id && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setUpdateBillModal(true)}
                            className="hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 transition"
                            title="Edit bill"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="hover:bg-destructive/10 text-destructive py-2transition rounded-lg px-3"
                            title="Delete bill"
                            onClick={handleDelete}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      )}
                    </div>
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

                {resolvedBills.isScanned && (
                  <BillDetailsItemsList
                    items={itemsList}
                    members={membersList}
                    setItemsList={setItemsList}
                  />
                )}

                <div className="bg-card border-border mt-5 flex justify-between rounded-xl border p-10">
                  <p className="text-card-foreground text-3xl font-bold">
                    Total
                  </p>
                  <p className="text-primary text-3xl font-bold">
                    ${resolvedBills.total_amount.toFixed(2)}
                  </p>
                </div>

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
                <Modal
                  open={updateBillModal}
                  onClose={() => setUpdateBillModal(false)}
                  heading="Edit Bill"
                >
                  <UpdateBill
                    billId={resolvedBills.id}
                    onSuccess={updateBillOnSuccess}
                  />
                </Modal>
              </motion.div>
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
