import HomePageRecentBills from "../components/Home/HomePageRecentBills.jsx";
import HomepageSummary from "./../components/Home/HomePageSummary.jsx";

function HomePage() {
  return (
    <section className="bg-background m-auto max-w-300 px-5 py-7">
      <p className="text-foreground mb-2 text-2xl font-bold md:text-4xl">
        Welcome back!
      </p>
      <p className="text-muted-foreground mb-4 md:text-lg">
        Here's your expense summary
      </p>
      <HomepageSummary />
      <HomePageRecentBills />
    </section>
  );
}

export default HomePage;
