import { Receipt, Save, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { Suspense, useRef, useState } from "react";
import { apiFetch } from "./../utils/Fetch";
import BackdropLoader from "../utils/BackdropLoader";
import { toast } from "sonner";
import BillDetailsItemList from "../components/Bill/BillDetailsItemList";
import Input from "../components/ui/Input";
import useInput from "../hooks/useInput";
import Select from "../components/ui/Select";
import { Await, Link, useLoaderData } from "react-router-dom";
import Button from "../components/ui/Button";

function ScanBill() {
  const { groups } = useLoaderData();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [group, setGroup] = useState("");

  const {
    value: billName,
    handleChange: handleBillNameChange,
    handleBlur: handleBillNameBlur,
    error: billNameError,
  } = useInput("");

  const openFileBrowser = () => {
    fileInputRef.current.click();
  };

  const openCamera = () => {
    cameraInputRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await apiFetch("/api/scan/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Extraction Complete");
        const data = await response.json();
        setItems(data.items);
      } else {
        toast.error("Failed to scan bill. Please try again.");
      }
    } catch (error) {
      toast.error("Server error while scanning bill.");
    } finally {
      setLoading(false);
    }
  };

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
          <>
            {items.length == 0 && (
              <div className="mt-5 flex flex-col gap-5">
                <p className="text-foreground text-xl font-bold md:text-2xl lg:text-3xl">
                  Scan Bill
                </p>

                <p className="text-muted-foreground">
                  Upload or capture a photo of your bill to automatically
                  extract items
                </p>

                <div
                  onClick={openFileBrowser}
                  className="border-border hover:border-primary flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 transition-colors"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-primary/10 rounded-full p-5"
                  >
                    <Upload className="text-primary" />
                  </motion.div>

                  <div className="text-center">
                    <p className="text-foreground mb-2 font-semibold">
                      Drop your bill here
                    </p>
                    <p className="text-muted-foreground text-sm">
                      or click to browse files
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={openFileBrowser}
                      className="border-border hover:bg-accent text-foreground rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
                    >
                      Browse Files
                    </button>

                    <button
                      onClick={openCamera}
                      className="border-border hover:bg-accent text-foreground rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
                    >
                      Take Photo
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    className="hidden"
                  />
                </div>
              </div>
            )}
            {items.length > 0 && (
              <div>
                <div className="mb-5 flex flex-col gap-2">
                  <p className="text-foreground text-xl font-bold md:text-2xl lg:text-3xl">
                    Review Bill
                  </p>
                  <p className="text-muted-foreground text-sm md:text-base">
                    Verify items and assign to a group
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
                  <div className="flex flex-col gap-5">
                    <Input
                      label="Bill Name"
                      placeholder="e.g, Dinner at Restaurant"
                      value={billName}
                      onChange={handleBillNameChange}
                      onBlur={handleBillNameBlur}
                      error={billNameError}
                    />
                    <div>
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
                  </div>
                </div>
                <BillDetailsItemList items={items} setItemsList={setItems} />
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
            )}
            {loading && <BackdropLoader />}
          </>
        )}
      </Await>
    </Suspense>
  );
}

export default ScanBill;

export async function loader() {
  return {
    groups: apiFetch("/api/groups", {
      method: "GET",
    }).then((res) => res.json()),
  };
}
