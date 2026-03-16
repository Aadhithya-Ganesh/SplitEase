import { TrendingUp, TrendingDown, CircleAlert, Clock } from "lucide-react";
import HomePageSummaryCards from "./HomePageSummaryCards.jsx";

function HomepageSummary({ owed, owe, balance, settlements }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <HomePageSummaryCards
        icon={
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <TrendingUp />
          </div>
        }
        heading={"You are owed"}
      >
        <p className="text-primary text-xl font-bold md:text-2xl">${owed}</p>
      </HomePageSummaryCards>
      <HomePageSummaryCards
        icon={
          <div className="bg-destructive/10 text-destructive rounded-lg p-2">
            <TrendingDown />
          </div>
        }
        heading={"You owe"}
      >
        <p className="text-destructive text-xl font-bold md:text-2xl">${owe}</p>
      </HomePageSummaryCards>
      <HomePageSummaryCards
        icon={
          <div
            className={`${balance < 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"} rounded-lg p-2`}
          >
            <CircleAlert />
          </div>
        }
        heading={"Net balance"}
      >
        <p
          className={`${balance < 0 ? "text-destructive" : "text-primary"} text-xl font-bold md:text-2xl`}
        >
          ${balance.toFixed(2)}
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
        <p className="text-xl font-bold md:text-2xl">{settlements}</p>
        <span>settlements</span>
      </HomePageSummaryCards>
    </div>
  );
}

export default HomepageSummary;
