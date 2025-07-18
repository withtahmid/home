import { createContext, useState } from "react";
import "./App.css";
import { trpc, trpcClient } from "./trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Hello from "./pages/Hello";

const AppContext = createContext(null);

const App = () => {
    const [client] = useState(() => trpcClient);
    const [queryClient] = useState(() => new QueryClient());

    return (
        <trpc.Provider client={client} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <Hello />
            </QueryClientProvider>
        </trpc.Provider>
    );
};

export default App;
