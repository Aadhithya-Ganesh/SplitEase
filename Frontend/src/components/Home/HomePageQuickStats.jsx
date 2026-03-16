function HomePageQuickStats({ stats }) {
  return (
    <div className="bg-card border-border mt-8 rounded-xl border p-5 md:p-10 lg:w-1/2">
      <p className="text-card-foreground text-lg font-semibold md:text-xl">
        Quick Stats
      </p>
      <div className="mt-5 flex flex-col gap-3 text-lg">
        <div className="bg-secondary/30 flex justify-between rounded-xl p-3 font-bold">
          <p className="text-muted-foreground">Total groups</p>
          <p className="text-foreground">{stats.total_groups}</p>
        </div>
        <div className="bg-secondary/30 flex justify-between rounded-xl p-3 font-bold">
          <p className="text-muted-foreground">Total Bills</p>
          <p className="text-foreground">{stats.total_bills}</p>
        </div>
        <div className="bg-secondary/30 flex justify-between rounded-xl p-3 font-bold">
          <p className="text-muted-foreground">Total Spent (All Groups)</p>
          <p className="text-foreground"> {stats.total_spent}</p>
        </div>
      </div>
    </div>
  );
}

export default HomePageQuickStats;
