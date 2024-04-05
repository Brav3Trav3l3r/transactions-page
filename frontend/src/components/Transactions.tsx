import { useState } from "react";
import TransactionTable from "./TransactionTable";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const months = [
  { name: "All", value: "" },
  { name: "Jan", value: 1 },
  { name: "Feb", value: 2 },
  { name: "Mar", value: 3 },
  { name: "Apr", value: 4 },
  { name: "May", value: 5 },
  { name: "Jun", value: 6 },
  { name: "Jul", value: 7 },
  { name: "Aug", value: 8 },
  { name: "Sep", value: 9 },
  { name: "Oct", value: 10 },
  { name: "Nov", value: 11 },
  { name: "Dec", value: 12 },
];

export default function Transactions() {
  const [month, setMonth] = useState(months[2]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const handlePage = (action: "prev" | "next") => {
    console.log(action);
    if (action == "prev" && page > 0) {
      setPage((prev) => prev - 1);
    } else if (action == "next") {
      setPage((next) => next + 1);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between mb-6">
        <Input
          className="max-w-96 border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={month}
          onValueChange={(e) => {
            setMonth(e);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((el) => (
              <SelectItem key={el.value} value={el}>
                {el.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TransactionTable
        handlePage={handlePage}
        month={month}
        page={page}
        perPage={perPage}
        search={search}
      />
    </div>
  );
}
