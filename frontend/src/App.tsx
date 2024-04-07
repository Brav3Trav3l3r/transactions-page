import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Transactions from "./components/Transactions";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-screen-xl mx-auto p-4">
        <p className="text-2xl font-bold mb-4">Transaction Table</p>
        <Transactions />
      </div>
    </QueryClientProvider>
  );
}

export default App;
