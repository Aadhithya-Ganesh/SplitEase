import { useLoaderData } from "react-router-dom";
import GroupPageHeader from "./../components/Group/GroupPageHeader";
import GroupPageBillItem from "../components/Group/GroupPageBillItem";
import { Plus, Receipt } from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

function GroupDetails() {
  const { name, members, bill, balance, bills } = useLoaderData();

  return (
    <div className="flex flex-col gap-10">
      <GroupPageHeader
        name={name}
        members={members}
        bill={bill}
        balance={balance}
      />
      <section>
        <div className="mb-5 flex justify-between">
          <div className="text-foreground flex items-center gap-2">
            <Receipt />
            <p className="text-lg font-bold md:text-xl">Bills</p>
          </div>
          <Link to="/scan">
            <Button className="bg-primary">
              <Plus />
              <p>Add Bill</p>
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {bills.map((item) => (
            <GroupPageBillItem key={item.id} bill={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default GroupDetails;

export async function loader() {
  const data = {
    id: 1,
    name: "Weekend Trip",
    members: 3,
    bill: 2,
    balance: -23.33,
    bills: [
      {
        id: 1,
        name: "Movie Night",
        total: 70.0,
        date: "Feb 20, 2024",
        payee: "Alex Johnson",
        pending: 2,
        balance: -23.33,
      },
      {
        id: 2,
        name: "Dinner at italian palce",
        total: 77.0,
        date: "Feb 15, 2024",
        payee: "Aadhithya Ganesh",
        pending: 1,
        balance: 23.33,
      },
      {
        id: 3,
        name: "Dinner at indian palce",
        total: 86.24,
        date: "Feb 2, 2024",
        payee: "Aadhithya Ganesh",
        pending: 0,
        balance: 0,
      },
    ],
  };

  return data;
}
