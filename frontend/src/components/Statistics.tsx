import { useQuery } from "@tanstack/react-query";

interface Month {
  name: string;
  value: number;
}

const getStats = async (month: Month) => {
  console.log(month);
  try {
    const res = await fetch(
      import.meta.env.VITE_BACKEND_URL +
        `/transactions/get-monthly-stats?month=${month.value}`
    );

    if (!res.ok) {
      throw new Error("Could not get monthly stats");
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

export default function Statistics(props: { month: Month }) {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["stats", props.month],
    queryFn: () => getStats(props.month),
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  console.log(data.data.stats[0]);

  return (
    <div className="border mt-8 max-w-[300px] p-4">
      <p className="text-xl font-bold mb-4">Statistics for {props.month.name}</p>

      <div className="flex justify-between">
        <p>Total Sale</p>
        <p>{data.data.stats[0].totalSaleAmount.toFixed(2)} $</p>
      </div>
      <div className="flex justify-between">
        <p>Total sold items</p>
        <p>{data.data.stats[0].totalSoldItems}</p>
      </div>
      <div className="flex justify-between">
        <p>Total not sold items</p>
        <p>{data.data.stats[0].totalUnsoldItems}</p>
      </div>
    </div>
  );
}
