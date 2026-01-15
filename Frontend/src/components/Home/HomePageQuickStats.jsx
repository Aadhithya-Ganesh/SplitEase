function HomePageQuickStats({ stats }) {
  return (
    <div className="bg-card border-border mt-8 rounded-xl border p-5 md:p-10 lg:w-1/2">
      <p className="text-card-foreground font-semibold">Quick Stats</p>
      <div className="mt-5 flex flex-col gap-3">
        <div className="bg-secondary/30 flex justify-between rounded-xl p-3 font-bold">
          <p className="text-muted-foreground">Total groups</p>
          <p className="text-foreground">{stats.groups}</p>
        </div>
        <div className="bg-secondary/30 flex justify-between rounded-xl p-3 font-bold">
          <p className="text-muted-foreground">Total Bills</p>
          <p className="text-foreground">{stats.bills}</p>
        </div>
        <div className="bg-secondary/30 flex justify-between rounded-xl p-3 font-bold">
          <p className="text-muted-foreground">Total Spent (All Groups)</p>
          <p className="text-foreground"> {stats.spent}</p>
        </div>
        <div className="bg-secondary/30 flex justify-between rounded-xl p-3 font-bold">
          <p className="text-muted-foreground">Most Active Group</p>
          <p className="text-foreground">{stats.active}</p>
        </div>
      </div>
    </div>
  );
}

export default HomePageQuickStats;
