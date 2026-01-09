import { TrendingUp, TrendingDown, CircleAlert, Clock } from "lucide-react";
import HomePageSummaryCards from "./HomePageSummaryCards.jsx";

function HomepageSummary() {
  const info = {
    owed: 75.67,
    owe: 57.83,
    settlements: 4,
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
      <HomePageSummaryCards
        icon={
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <TrendingUp />
          </div>
        }
        heading={"You are owed"}
      >
        <p className="text-primary text-xl font-bold">${info.owed}</p>
      </HomePageSummaryCards>
      <HomePageSummaryCards
        icon={
          <div className="bg-destructive/10 text-destructive rounded-lg p-2">
            <TrendingDown />
          </div>
        }
        heading={"You owe"}
      >
        <p className="text-destructive text-xl font-bold">${info.owe}</p>
      </HomePageSummaryCards>
      <HomePageSummaryCards
        icon={
          <div
            className={`${info.owed - info.owe < 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"} rounded-lg p-2`}
          >
            <CircleAlert />
          </div>
        }
        heading={"Net balance"}
      >
        <p
          className={`${info.owed - info.owe < 0 ? "text-destructive" : "text-primary"} text-xl font-bold`}
        >
          ${(info.owed - info.owe).toFixed(2)}
        </p>
      </HomePageSummaryCards>
      <HomePageSummaryCards
        icon={
          <div className="bg-foreground/10 text-foreground rounded-lg p-2">
            <Clock />
          </div>
        }
        heading={"Pending"}
      >
        <p className="text-xl font-bold">{info.settlements}</p>
        <span>settlements</span>
      </HomePageSummaryCards>
    </div>
  );
}

export default HomepageSummary;
