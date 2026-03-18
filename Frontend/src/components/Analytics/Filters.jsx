import { Filter } from "lucide-react";
import Select from "./../ui/Select";
import { useState } from "react";
import Summary from "./Summary";

function Fitlers({ resolvedGroups }) {
  const [month, setMonth] = useState(0);
  const [group, setGroup] = useState("all");

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row">
        <div className="text-muted-foreground flex items-center gap-4 text-lg md:text-xl">
          <Filter className="size-5 md:size-6" />
          <p>Filters</p>
        </div>
        <div className="flex w-full flex-col gap-5 sm:w-100 sm:flex-row">
          <Select
            value={month}
            onChange={setMonth}
            options={[
              { label: "All Months", value: 0 },
              { label: "January", value: 1 },
              { label: "Febraury", value: 2 },
              { label: "March", value: 3 },
              { label: "April", value: 4 },
              { label: "May", value: 5 },
              { label: "June", value: 6 },
              { label: "July", value: 7 },
              { label: "August", value: 8 },
              { label: "September", value: 9 },
              { label: "October", value: 10 },
              { label: "November", value: 11 },
              { label: "December", value: 12 },
            ]}
            size="sm"
          />
          <Select
            value={group}
            onChange={setGroup}
            options={[
              { label: "All Groups", value: "all" },
              ...resolvedGroups.map((group) => ({
                label: group.name,
                value: group.id,
              })),
            ]}
            size="sm"
          />
        </div>
      </div>
      <Summary month={month} group={group} />
    </div>
  );
}

export default Fitlers;
