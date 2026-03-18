import { BarChart3 } from "lucide-react";
import Fitlers from "../components/Analytics/Filters";
import { apiFetch } from "../utils/Fetch";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import BackdropLoader from "../utils/BackdropLoader";
import AIChatSection from "../components/Analytics/AIChatSection";

function AnalyticsPage() {
  const { groups } = useLoaderData();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-xl md:text-2xl lg:text-3xl">
          <BarChart3 className="text-primary size-6 md:size-7 lg:size-8" />
          <p className="text-foreground font-bold">Analytics & Insights</p>
        </div>
        <p className="text-muted-foreground mt-4 text-base">
          Track your spending patterns and get AI-powered insights
        </p>
      </div>
      <Suspense fallback={<BackdropLoader />}>
        <Await resolve={groups}>
          {(resolvedGroups) => (
            <>
              <Fitlers resolvedGroups={resolvedGroups} />
              <AIChatSection />
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export default AnalyticsPage;

export async function loader() {
  return {
    groups: apiFetch("/api/groups", {
      method: "GET",
    }).then((res) => res.json()),
  };
}
