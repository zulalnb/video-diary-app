import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function QueryProvider(props: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
