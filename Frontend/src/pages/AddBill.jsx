import { Camera, Pencil } from "lucide-react";
import CardLinks from "../components/CardLinks";

function AddBill() {
  return (
    <div className="m-auto mt-10 max-w-200">
      <div className="flex flex-col gap-4">
        <p className="text-foreground text-xl font-bold md:text-2xl lg:text-3xl">
          Add Bill
        </p>
        <p className="text-muted-foreground text-lg font-medium">
          How would you like to add your bill?
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <CardLinks
          url={"/bill/scan"}
          title="Scan Bill"
          description="Upload or take a photo of your bill to automatically extract and itemize everything."
          icon={<Camera className="text-primary" />}
        />
        <CardLinks
          url={"/bill/manual"}
          title="Manual Entry"
          description="Manually enter bill details if you don't have a digital copy."
          icon={<Pencil className="text-primary" />}
        />
      </div>
    </div>
  );
}

export default AddBill;
