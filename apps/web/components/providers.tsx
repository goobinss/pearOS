"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { defineChain, parseUnits } from "viem";
import type { PublicConfig } from "@/lib/config";
import type { Balance, Observation } from "@/lib/types";
import { useNow } from "./use-now";

const ConfigContext = createContext<PublicConfig | null>(null);
export function Providers({
  config,
  children,
}: {
  config: PublicConfig;
  children: ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const [walletConfig] = useState(() => {
    const chain = defineChain({
      id: config.chainId,
      name:
        config.chainId === 4663 ? "Robinhood Chain" : "Robinhood Chain Testnet",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: [config.rpcUrl] } },
      blockExplorers: {
        default: { name: "Blockscout", url: config.explorerUrl },
      },
    });
    return createConfig({
      chains: [chain],
      connectors: [injected()],
      transports: { [chain.id]: http(config.rpcUrl) },
      ssr: true,
    });
  });
  return (
    <ConfigContext.Provider value={config}>
      <WagmiProvider config={walletConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ConfigContext.Provider>
  );
}
export function usePublicConfig() {
  const config = useContext(ConfigContext);
  if (!config) throw new Error("Missing PearOS configuration");
  return config;
}
export async function readApi<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok)
    throw new Error("Data could not be refreshed. Please try again.");
  return response.json() as Promise<T>;
}
export function useHolder() {
  const config = usePublicConfig();
  const account = useAccount();
  const now = useNow();
  const correctNetwork = account.chainId === config.chainId;
  const balances = useQuery({
    queryKey: ["wallet", account.address, config.chainId],
    queryFn: () =>
      readApi<Observation<Balance[]>>(`/api/wallet?address=${account.address}`),
    enabled: !!account.address && correctNetwork,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  const a2p = balances.data?.data?.find((balance) => balance.symbol === "A2P");
  let isHolder = false;
  const observationAge = now !== null && balances.data?.observedAt
    ? now - Date.parse(balances.data.observedAt)
    : Infinity;
  if (
    account.isConnected &&
    correctNetwork &&
    !balances.isError &&
    observationAge >= -30_000 &&
    observationAge <= 120_000 &&
    a2p?.amount !== null &&
    a2p?.amount !== undefined &&
    a2p.decimals !== null &&
    ["live", "cached"].includes(balances.data?.status || "")
  ) {
    try {
      const minimum = parseUnits(config.holderMinimum, a2p.decimals);
      isHolder =
        minimum > 0n && parseUnits(a2p.amount, a2p.decimals) >= minimum;
    } catch {
      isHolder = false;
    }
  }
  return { ...account, correctNetwork, balances, isHolder };
}
