import Button from "./../components/ui/Button";
import { MoveLeft, MoveRight, Save } from "lucide-react";
import { Form, useLoaderData, useNavigate, Link } from "react-router-dom";
import BillDetailsSplitSummary from "../components/Bill/BillDetailsSplitSummary";
import BillDetailsItemsList from "../components/Bill/BillDetailsItemList";

function BillDetails() {
  const navigate = useNavigate();
  const data = useLoaderData();

  return (
    <div className="flex flex-col gap-5">
      <Button
        className="text-foreground hover:bg-accent w-fit py-4"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
        <p>Back to Group</p>
      </Button>
      <div className="my-6">
        <div className="text-foreground flex items-center justify-between">
          <p className="text-2xl font-bold md:text-4xl">{data.name}</p>
          <div className="text-right font-semibold md:text-xl">
            <p className="text-muted-foreground">Paid by</p>
            <p>{data.payee}</p>
          </div>
        </div>
        <p className="text-muted-foreground text-lg md:text-xl">
          Review items and manage settlements
        </p>
      </div>
      <BillDetailsSplitSummary members={data.members} payee={data.payee} />
      <BillDetailsItemsList items={data.items} />
      <Form className="flex w-full items-center gap-7">
        <Button type="submit" className="text-foreground w-full py-4">
          <Save size={18} />
          <p>Save Changes</p>
        </Button>
        <Link to={`/bill/${data.id}/split`} className="w-full">
          <Button className="bg-primary w-full py-4">
            <p>Split Bill</p>
            <MoveRight size={18} />
          </Button>
        </Link>
      </Form>
    </div>
  );
}

export default BillDetails;

export async function loader() {
  const data = {
    id: 1,
    name: "Movie Night",
    payee: "Aadhithya Ganesh",
    total: 160,
    members: [
      {
        id: 1,
        name: "Aadhithya Ganesh",
        split: 23.33,
        pending: false,
        payee: true,
      },
      {
        id: 2,
        name: "Alex Johnson",
        split: 23.33,
        pending: true,
        payee: false,
      },
      {
        id: 3,
        name: "Sarah Miller",
        split: 23.33,
        pending: true,
        payee: false,
      },
    ],
    items: [
      {
        id: 1,
        name: "Movie Tickets",
        quantity: 3,
        price: 45,
      },
      {
        id: 2,
        name: "Popcorn & Drinks",
        quantity: 1,
        price: 25,
      },
    ],
  };

  // const data = {
  //   id: 1,
  //   name: "Movie Night",
  //   payee: "Alex Johnson",
  //   total: 160,
  //   members: [
  //     {
  //       id: 1,
  //       name: "Aadhithya Ganesh",
  //       split: 23.33,
  //       pending: false,
  //       payee: false,
  //     },
  //     {
  //       id: 2,
  //       name: "Alex Johnson",
  //       split: 23.33,
  //       pending: false,
  //       payee: true,
  //     },
  //     {
  //       id: 3,
  //       name: "Sarah Miller",
  //       split: 23.33,
  //       pending: true,
  //       payee: false,
  //     },
  //   ],
  //   items: [
  //     {
  //       id: 1,
  //       name: "Movie Tickets",
  //       quantity: 3,
  //       price: 45,
  //     },
  //     {
  //       id: 2,
  //       name: "Popcord & Drinks",
  //       quantity: 1,
  //       price: 25,
  //     },
  //   ],
  // };

  return data;
}
