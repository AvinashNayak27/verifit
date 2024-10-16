"use client";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <ClerkProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ClerkProvider>
  );
}
