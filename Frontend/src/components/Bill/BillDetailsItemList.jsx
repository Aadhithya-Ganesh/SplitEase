import { GripVertical, Plus, Trash, DollarSign } from "lucide-react";
import { Reorder } from "motion/react";
import { useState } from "react";
import Input from "./../ui/Input";
import Button from "../ui/Button";

function BillDetailsItemsList({ items }) {
  const [itemsList, setItemsList] = useState(items);
  const [newItem, setNewItem] = useState("");

  function updateItem(id, updates) {
    setItemsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function deleteItem(id) {
    setItemsList((prev) => prev.filter((item) => item.id !== id));
  }

  function addItem() {
    if (!newItem.trim()) return;

    setItemsList((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newItem,
        quantity: 1,
        price: 0,
      },
    ]);

    setNewItem("");
  }

  const total = itemsList.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return (
    <>
      <div className="bg-card border-border rounded-xl border">
        {/* HEADER */}
        <div className="text-muted-foreground grid grid-cols-[auto_1fr_110px_140px_auto] items-center gap-4 p-5 font-semibold lg:grid-cols-[auto_1fr_160px_200px_auto]">
          <span />
          <p className="ml-6">Item</p>
          <p className="text-center">Qty</p>
          <p className="text-center">Price</p>
          <span />
        </div>

        {/* ITEMS */}
        <Reorder.Group values={itemsList} onReorder={setItemsList}>
          {itemsList.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="text-foreground border-border grid grid-cols-[auto_1fr_110px_140px_auto] items-center gap-4 border-t p-5 text-sm lg:grid-cols-[auto_1fr_160px_200px_auto]"
            >
              {/* DRAG */}
              <GripVertical className="text-muted-foreground cursor-grab" />

              {/* NAME */}
              <p className="truncate text-lg font-medium">{item.name}</p>

              {/* QTY */}
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, {
                    quantity: Math.max(1, Number(e.target.value)),
                  })
                }
                className="mt-0 h-10 text-center font-semibold"
              />

              {/* PRICE */}
              <Input
                type="number"
                icon={<DollarSign />}
                value={item.price}
                onChange={(e) =>
                  updateItem(item.id, {
                    price: Math.max(0, Number(e.target.value)),
                  })
                }
                className="mt-0 h-10 text-right font-semibold"
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
      <div className="bg-card border-border flex justify-between rounded-xl border p-10">
        <p className="text-card-foreground text-3xl font-bold">Total</p>
        <p className="text-primary text-3xl font-bold">${total.toFixed(2)}</p>
      </div>
    </>
  );
}

export default BillDetailsItemsList;
