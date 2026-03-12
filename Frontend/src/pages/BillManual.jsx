import { Receipt, Save, X } from "lucide-react";
import Input from "../components/ui/Input";
import useInput from "../hooks/useInput";
import Select from "../components/ui/Select";
import DatePicker from "../components/ui/DatePicker";
import { Await, Link, useLoaderData } from "react-router-dom";
import { Suspense, useState } from "react";
import BackdropLoader from "../utils/BackdropLoader";
import Button from "../components/ui/Button";

function BillManual() {
  const { groups } = useLoaderData();

  const {
    value: billName,
    handleChange: handleBillNameChange,
    handleBlur: handleBillNameBlur,
    error: billNameError,
  } = useInput("");

  const {
    value: totalAmount,
    handleChange: handleTotalAmountChange,
    handleBlur: handleTotalAmountBlur,
    error: totalAmountError,
  } = useInput("");

  const [group, setGroup] = useState("");
  const [date, setDate] = useState("");

  const handleCreateBill = async () => {
    if (!billName) {
      toast.error("Please enter bill name");
      return;
    }

    if (!group) {
      toast.error("Please select a group");
      return;
    }

    if (items.length === 0) {
      toast.error("No items found");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        group_id: group,
        title: billName,
        created_at: date
          ? new Date(date).toISOString()
          : new Date().toISOString(),
        items: items.map((item) => ({
          name: item.name,
          amount: item.price,
          quantity: item.quantity,
          split_mode: "equal",
          participants: [],
        })),
      };

      const response = await apiFetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Bill created successfully");
      return navigate("/groups/" + group);
    } catch (err) {
      toast.error("Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<BackdropLoader />}>
      <Await resolve={groups}>
        {(groups) => (
          <div className="m-auto mt-10 max-w-200">
            <div className="flex flex-col gap-4">
              <p className="text-foreground text-xl font-bold md:text-2xl lg:text-3xl">
                Manual Bill
              </p>
              <p className="text-muted-foreground text-lg font-medium">
                Enter the total and split it among your group
              </p>
            </div>
            <div className="bg-card border-border my-5 flex flex-col gap-8 rounded-xl border p-8">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 w-fit rounded-lg p-2">
                  <Receipt className="text-primary" />
                </div>
                <p className="text-foreground text-lg font-bold md:text-xl">
                  Bill details
                </p>
              </div>
              <div className="flex flex-col gap-7">
                <Input
                  label="Bill Name"
                  placeholder="e.g, Dinner at Restaurant"
                  value={billName}
                  onChange={handleBillNameChange}
                  onBlur={handleBillNameBlur}
                  error={billNameError}
                />
                <Input
                  label="Total Amount"
                  placeholder="e.g, 100.00"
                  value={totalAmount}
                  onChange={handleTotalAmountChange}
                  onBlur={handleTotalAmountBlur}
                  error={totalAmountError}
                />
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div className="w-full">
                    <p className="text-foreground mb-3 text-sm font-bold">
                      Select Group
                    </p>
                    <Select
                      value={group}
                      onChange={setGroup}
                      options={groups.map((group) => ({
                        label: group.name,
                        value: group.id,
                      }))}
                      size="sm"
                      placeholder="Choose a Group"
                    />
                  </div>
                  <div>
                    <p className="text-foreground mb-3 text-sm font-bold">
                      Select Date
                    </p>
                    <DatePicker value={date} onChange={setDate} />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex w-full items-center gap-7">
                <Link className="w-full" to={"/home"}>
                  <Button className="bg-background hover:bg-accent w-full py-4">
                    <X size={18} className="text-foreground" />
                    <p className="text-foreground">Cancel</p>
                  </Button>
                </Link>
                <div className="w-full">
                  <Button
                    className="bg-primary w-full py-4"
                    onClick={handleCreateBill}
                  >
                    <Save size={18} />
                    <p>Create Bill</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export default BillManual;
