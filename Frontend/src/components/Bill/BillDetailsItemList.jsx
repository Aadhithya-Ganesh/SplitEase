import { GripVertical, Plus, Trash, DollarSign } from "lucide-react";
import { Reorder } from "motion/react";
import { useRef, useState } from "react";
import Input from "./../ui/Input";
import Button from "../ui/Button";
import { useParams } from "react-router-dom";
import { apiFetch } from "../../utils/Fetch";
import { toast } from "sonner";

function BillDetailsItemsList({ items, setItemsList, members = null }) {
  const [newItem, setNewItem] = useState("");
  const { billId } = useParams();
  const updateTimers = useRef({});

  function persistItemUpdate(id, updates) {
    if (updateTimers.current[id]) {
      clearTimeout(updateTimers.current[id]);
    }

    updateTimers.current[id] = setTimeout(async () => {
      const body = {};
      if (updates.quantity !== undefined) body.quantity = updates.quantity;
      if (updates.price !== undefined) body.amount = updates.price;
      if (updates.quantity === "") return;
      if (updates.price === "") return;

      const response = await apiFetch(`/api/items/${id}`, {
        method: "PUT",
        body,
      });

      if (!response.ok) {
        toast.error("Failed to update item");
      }
    }, 800);
  }

  function updateItem(id, updates) {
    setItemsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );

    persistItemUpdate(id, updates);
  }

  async function deleteItem(id) {
    const response = await apiFetch(`/api/items/${id}`, { method: "DELETE" });

    if (response.ok) {
      toast.success("Item deleted");
      setItemsList((prev) => prev.filter((item) => item.id !== id));
    } else {
      toast.error("Error occured");
    }
  }

  function buildEqualParticipants(members) {
    const count = members.length;
    if (!count) return [];

    const base = +(100 / count).toFixed(2);
    const remainder = +(100 - base * count).toFixed(2);

    return members.map((m, idx) => ({
      user_id: m.id,
      percentage: idx === 0 ? base + remainder : base, // fix rounding
    }));
  }

  async function addItem() {
    if (!newItem.trim()) return;

    const response = await apiFetch("/api/items", {
      method: "POST",
      body: {
        bill_id: billId,
        name: newItem,
        amount: 0,
        quantity: 1,
      },
    });

    if (!response.ok) {
      toast.error("Error occurred");
      return;
    }

    const data = await response.json();

    if (members) {
      const participants = buildEqualParticipants(members);

      setItemsList((prev) => [
        ...prev,
        {
          id: data.id,
          name: newItem,
          quantity: 1,
          price: 0,
          total: 0,
          participants,
        },
      ]);
    }

    toast.success("Item added");
    setNewItem("");
  }

  return (
    <>
      <div className="bg-card border-border rounded-xl border">
        {/* HEADER */}
        <div className="text-muted-foreground grid grid-cols-[auto_1fr_0px_150px_auto] items-center gap-4 p-5 font-semibold lg:grid-cols-[auto_1fr_160px_200px_auto]">
          <span />
          <p className="ml-6">Item</p>
          <p className="text-center">Qty</p>
          <p className="text-center">Price</p>
          <span />
        </div>

        {/* ITEMS */}
        <Reorder.Group values={items} onReorder={setItemsList}>
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="text-foreground border-border grid grid-cols-[auto_1fr_80px_100px_auto] items-center gap-4 border-t p-5 text-sm md:grid-cols-[auto_1fr_160px_200px_auto]"
            >
              {/* DRAG */}
              <GripVertical className="text-muted-foreground cursor-grab" />

              {/* NAME */}
              <p className="truncate text-lg font-medium" title={item.name}>
                {item.name}
              </p>

              {/* QTY */}
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, {
                    quantity:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                onBlur={() => {
                  if (!item.quantity || item.quantity < 1) {
                    updateItem(item.id, { quantity: 1 });
                  }
                }}
                className="mt-0 h-10 text-left font-semibold md:text-center"
              />

              {/* PRICE */}
              <Input
                type="number"
                icon={<DollarSign />}
                value={item.price}
                onChange={(e) =>
                  updateItem(item.id, {
                    price: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                onBlur={() => {
                  if (item.price === "" || item.price < 0) {
                    updateItem(item.id, { price: 0 });
                  }
                }}
                className="mt-0 h-10 text-left font-semibold md:text-right"
              />

              {/* DELETE */}
              <button
                onClick={() => deleteItem(item.id)}
                className="text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg p-3 transition-colors"
              >
                <Trash size={18} />
              </button>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* ADD ITEM */}
        <div className="border-border flex w-full items-center gap-2 border-t p-5">
          <div className="min-w-0 flex-1">
            <Input
              placeholder="Add new item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="w-full"
            />
          </div>

          <Button className="bg-primary mt-3 h-12" onClick={addItem}>
            <Plus size={15} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default BillDetailsItemsList;
