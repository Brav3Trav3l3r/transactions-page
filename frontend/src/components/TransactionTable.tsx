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

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[100px]">ID</TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center ">Description</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Sold</TableHead>
            <TableHead className="text-center">Images</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.transactions.map((el: Transaction) => (
            <TableRow>
              <TableCell className="text-center font-medium">{el.id}</TableCell>
              <TableCell className="text-center max-w-prose">
                {el.title}
              </TableCell>
              <TableCell className="text-center max-w-prose ">
                {el.description}
              </TableCell>
              <TableCell className="text-center">
                {el.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">{el.category}</TableCell>
              <TableCell className="text-center">{`${el.sold}`}</TableCell>
              <TableCell className="max-w-[200px]">
                <img src={el.image} alt="" className="object-contain" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              <div className="flex justify-between items-center">
                <p>Page no. {props.page}</p>
                <div className="flex gap-4">
                  <Button
                    disabled={props.page === 1}
                    onClick={() => props.handlePage("prev")}
                  >
                    Prev
                  </Button>
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
