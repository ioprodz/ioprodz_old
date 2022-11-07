import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useTranslation } from "react-i18next";
import { Routes } from "./Routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  );
};

export default App;
