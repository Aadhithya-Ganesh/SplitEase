import HomePageQuickStats from "../components/Home/HomePageQuickStats.jsx";
import HomePageRecentBills from "../components/Home/HomePageRecentBills.jsx";
import HomepageSummary from "./../components/Home/HomePageSummary.jsx";
import { apiFetch } from "../utils/Fetch.jsx";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import BackdropLoader from "../utils/BackdropLoader.jsx";
import { motion } from "motion/react";

function HomePage() {
  const { data } = useLoaderData();

  return (
    <section>
      <p className="text-foreground mb-2 text-2xl font-bold md:text-4xl">
        Welcome back!
      </p>
      <p className="text-muted-foreground mb-4 md:text-lg">
        Here's your expense summary
      </p>
      <Suspense fallback={<BackdropLoader />}>
        <Await resolve={data}>
          {(resolvedData) => (
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <HomepageSummary
                owed={resolvedData.you_are_owed}
                owe={resolvedData.you_owe}
                balance={resolvedData.net_balance}
                settlements={resolvedData.pending_settlements}
              />
              <div className="gap-5 lg:flex">
                <HomePageRecentBills bills={resolvedData.recent_bills} />
                <HomePageQuickStats stats={resolvedData.quick_stats} />
              </div>
            </motion.div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

export default HomePage;

export async function loader() {
  return {
    data: apiFetch("/api/analytics/dashboard", { method: "GET" }).then((res) =>
      res.json(),
    ),
  };
}
