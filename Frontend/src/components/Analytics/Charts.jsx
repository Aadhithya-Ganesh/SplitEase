import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONTHS = [
  "",
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function Charts({ monthly_spending = [], selectedMonth }) {
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setChartKey((k) => k + 1), 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  let labels = [];
  let values = [];

  if (selectedMonth === 0) {
    // fill all 12 months
    const map = {};

    monthly_spending.forEach((m) => {
      map[m.month] = m.amount;
    });

    for (let i = 1; i <= 12; i++) {
      labels.push(MONTHS[i]);
      values.push(map[i] || 0);
    }
  } else {
    // only one month
    const entry = monthly_spending[0];
    if (entry) {
      labels = [MONTHS[entry.month]];
      values = [entry.amount];
    }
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Spending",
        data: values,
        backgroundColor: "#22c35d",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="bg-card border-border mt-5 w-full overflow-hidden rounded-xl border p-5">
      <div className="relative h-100 w-full overflow-hidden">
        <Bar key={chartKey} data={data} options={options} />
      </div>
    </div>
  );
}

export default Charts;
