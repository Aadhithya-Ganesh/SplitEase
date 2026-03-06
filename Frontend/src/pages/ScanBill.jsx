import { Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { apiFetch } from "./../utils/Fetch";
import BackdropLoader from "../utils/BackdropLoader";
import { toast } from "sonner";
import BillDetailsItemList from "../components/Bill/BillDetailsItemList";

function ScanBill() {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

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

  return (
    <div className="mt-5 flex flex-col gap-5">
      {items.length == 0 && (
        <>
          <p className="text-foreground text-xl font-bold md:text-2xl lg:text-3xl">
            Scan Bill
          </p>

          <p className="text-muted-foreground">
            Upload or capture a photo of your bill to automatically extract
            items
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
        </>
      )}
      {items.length > 0 && (
        <BillDetailsItemList items={items} setItemsList={setItems} />
      )}
      {loading && <BackdropLoader />}
    </div>
  );
}

export default ScanBill;
