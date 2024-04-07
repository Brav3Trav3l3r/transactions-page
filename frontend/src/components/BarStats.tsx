import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// const data = [
//   { name: "0 - 100", count: 2 },
//   { name: "100 - 200", count: 2 },
//   { name: "200 - 300", count: 2 },
//   { name: "300 - 400", count: 6 },
//   { name: "400 - 500", count: 7 },
//   { name: "500 - 600", count: 5 },
//   { name: "600 - 700", count: 1 },
//   { name: "700 - 800", count: 2 },
//   { name: "800 - 900", count: 4 },
// ];

interface Month {
  name: string;
  value: number;
}

const getRanges = async (month: Month) => {
  try {
    const res = await fetch(
      import.meta.env.VITE_BACKEND_URL +
        `/transactions/get-price-ranges?month=${month.value}`
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

export default function BarStats({ month }: { month: Month }) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["ranges", month],
    queryFn: () => getRanges(month),
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="mt-8 border p-4">
      <p className="text-xl font-bold">Bar chart stats - {month.name} </p>
      <ResponsiveContainer height={300} width={"100%"} className="mt-8">
        <BarChart data={data.data.ranges}>
          <XAxis dataKey="range" padding={{ left: 30, right: 30 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
