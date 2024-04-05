import { Transaction } from "@/types/Transaction";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";

interface TransactionTableProps {
  month: { name: string; value: number };
  page: number;
  perPage: number;
  search: string;
  handlePage: (action: "prev" | "next") => void;
}

export default function TransactionTable(props: TransactionTableProps) {
  const getTransactions = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_URL +
          `/transactions?page=${props.page}&perPage=${props.perPage}&month=${props.month.value}&search=${props.search}`
      );

      if (!res.ok) {
        throw new Error("Could not fetch transactions");
      }

      return res.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Something went wrong"); 
    }
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      "transactions",
      props.month,
      props.page,
      props.perPage,
      props.search,
    ],
    queryFn: getTransactions,
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  console.log(data.data);

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] border">ID</TableHead>
            <TableHead className="text-center border">Title</TableHead>
            <TableHead className="text-center border">Description</TableHead>
            <TableHead className="text-center border">Price</TableHead>
            <TableHead className="text-center border">Category</TableHead>
            <TableHead className="text-center border">Sold</TableHead>
            <TableHead className="text-center border">Images</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.transactions.map((el: Transaction) => (
            <TableRow>
              <TableCell className="font-medium">{el.id}</TableCell>
              <TableCell className="text-center">{el.title}</TableCell>
              <TableCell className="text-center">{el.description}</TableCell>
              <TableCell className="text-center">{el.price}</TableCell>
              <TableCell className="text-center">{el.category}</TableCell>
              <TableCell className="text-center">{el.sold}</TableCell>
              <TableCell className="text-center">{el.image}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-between items-center">
                <p>Page no. {props.page}</p>
                <div className="flex gap-4">
                  <Button onClick={() => props.handlePage("prev")}>Prev</Button>
                  <Button onClick={() => props.handlePage("next")}>Next</Button>
                </div>
                <p>Page no. {props.perPage}</p>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
