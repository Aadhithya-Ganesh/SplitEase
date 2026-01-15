import HomePageQuickStats from "../components/Home/HomePageQuickStats.jsx";
import HomePageRecentBills from "../components/Home/HomePageRecentBills.jsx";
import HomepageSummary from "./../components/Home/HomePageSummary.jsx";

const bills = [
  {
    id: "bill_001",
    title: "Movie Night",
    date: "2024-02-20",
    status: "owed", // "owed" | "settled" | "owed_to_you"
    amount: 23.33,
    currency: "USD",
    direction: "outgoing", // outgoing = you owe, incoming = they owe you
    icon: "receipt", // semantic icon key
  },
  {
    id: "bill_002",
    title: "Monthly Groceries",
    date: "2024-02-18",
    status: "owed",
    amount: 34.5,
    currency: "USD",
    direction: "outgoing",
    icon: "receipt",
  },
  {
    id: "bill_003",
    title: "Dinner at Italian Place",
    date: "2024-02-15",
    status: "settled",
    totalAmount: 77.0,
    currency: "USD",
    direction: "none",
    icon: "check",
  },
];

const stats = {
  groups: 3,
  bills: 3,
  spent: 1789.5,
  active: "Roommates",
};

function HomePage() {
  return (
    <section className="bg-background m-auto max-w-300 px-5 py-7">
      <p className="text-foreground mb-2 text-2xl font-bold md:text-4xl">
        Welcome back!
      </p>
      <p className="text-muted-foreground mb-4 md:text-lg">
        Here's your expense summary
      </p>
      <div className="mt-10">
        <HomepageSummary />
        <div className="gap-5 lg:flex">
          <HomePageRecentBills bills={bills} />
          <HomePageQuickStats stats={stats} />
        </div>
      </div>
    </section>
  );
}

export default HomePage;
