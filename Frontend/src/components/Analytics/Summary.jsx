import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/Fetch";
import { ChartColumn, ChartPie, TrendingUp } from "lucide-react";
import Charts from "./Charts";

function Summary({ month, group }) {
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchSummary() {
      const response = await apiFetch("/api/analytics/info", {
        method: "POST",
        params: { month, group },
      });
      const data = await response.json();
      setData(data);
    }
    fetchSummary();
  }, [group, month]);

  return (
    <>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        <div className="bg-card border-border flex flex-col gap-5 rounded-xl border p-5">
          <div className="flex justify-between">
            <p className="text-muted-foreground text-sm sm:text-base">
              Total spend
            </p>
            <TrendingUp className="text-primary size-5" />
          </div>
          <p className="text-card-foreground text-2xl font-semibold">
            ${data["total_spend"]?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-card border-border flex flex-col gap-5 rounded-xl border p-5">
          <div className="flex justify-between">
            <p className="text-muted-foreground text-sm sm:text-base">
              Total Bills
            </p>
            <ChartColumn className="text-foreground size-5" />
          </div>
          <p className="text-card-foreground text-2xl font-semibold">
            {data["total_bills"] || 0}
          </p>
        </div>
        <div className="bg-card border-border col-span-2 flex flex-col gap-5 rounded-xl border p-5 sm:col-span-1">
          <div className="flex justify-between">
            <p className="text-muted-foreground text-sm sm:text-base">
              Avg per Bill
            </p>
            <ChartPie className="text-foreground size-5" />
          </div>
          <p className="text-card-foreground text-2xl font-semibold">
            ${data["avg_per_bill"]?.toFixed(2) || 0}
          </p>
        </div>
      </div>
      <Charts monthly_spending={data.monthly_spending} selectedMonth={month} />
    </>
  );
}

export default Summary;
