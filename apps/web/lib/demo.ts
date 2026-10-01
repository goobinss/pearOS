import type { Config } from "./config";
import type { Dashboard } from "@pearos/shared-types";
import type { Observation, RatioPoint } from "./types";
import { calculatePearRatio } from "./pear-ratio";

const simulated = <T>(
  data: T,
  date = new Date().toISOString(),
): Observation<T> => ({
  data,
  status: "demo",
  source: "DEMO · simulated example, not market data",
  observedAt: date,
  fetchedAt: date,
});
export function demoDashboard(config: Config): Dashboard {
  const now = Date.now(),
    date = new Date(now).toISOString();
  const points: RatioPoint[] = Array.from({ length: 97 }, (_, index) => {
    const ratio =
      index === 96
        ? 100_000
        : 100_000 +
          Math.sin(index / 7) * 4300 +
          Math.cos(index / 3) * 1100 -
          (96 - index) * 80;
    const a2p = (250 / ratio).toFixed(12);
    return {
      timestamp: new Date(now - (96 - index) * 900_000).toISOString(),
      aaplPriceUsd: "250",
      a2pPriceUsd: a2p,
      pearsPerApple: calculatePearRatio("250", a2p),
    };
  });
  return {
    mode: "demo",
    chainId: config.chainId,
    a2pAddress: null,
    aaplAddress: config.aaplAddress,
    treasuryAddress: null,
    treasuryBalances: demoTreasury(config).balances,
    explorerUrl: config.explorerUrl,
    fetchedAt: date,
    stock: {
      metadata: simulated({
        address: config.aaplAddress || "demo",
        name: "AAPL Stock Token · example",
        symbol: "AAPL",
        multiplier: "1",
        pendingMultiplier: null,
        pendingMultiplierEffectiveTime: null,
        status: "DEMO",
        tradingCapabilities: null,
      }),
      price: simulated({
        usd: "250",
        address: "demo",
        basis: "Simulated token-equivalent reference",
      }),
      halted: null,
    },
    project: simulated({
      address: "demo",
      name: "Apples to Pears",
      symbol: "A2P",
      creator: "demo",
      vault: "demo",
      curve: "demo",
      quote: "demo",
      version: 2,
      priceUsd: "0.0025",
      liquidityUsd: "68500",
      volume24hUsd: "124800",
      valuationUsd: "2500000",
      valuationBasis: "FDV",
      priceUpdatedAt: date,
      priceStale: false,
    }),
    readiness: {
      economics: simulated({
        launchConfigured: true,
        enabled: true,
        factory: "demo",
      }),
      asset: simulated({
        discovered: true,
        address: config.aaplAddress,
        routeVerified: false,
      }),
    },
    pons: simulated({
      curve: "demo",
      deployer: "demo",
      feeRecipient: "demo",
      quote: "demo",
      quoteSymbol: "ETH",
      phase: 2,
      phaseLabel: "Graduated · example",
      creatorTaxBps: 200,
      raised: null,
      threshold: "4.2",
      progressPercent: "100",
      marginalQuotePerA2p: null,
      readyToGraduate: null,
    }),
    vault: simulated({
      address: "demo",
      creator: "demo",
      quote: "demo",
      pool: "demo",
      paused: false,
      ethBalance: "0.62",
      a2pInventory: "18500",
      quoteInventory: "2.4",
      reservedLiquidityEth: "0.34",
      creatorClaimableEth: "0.17",
      releasedEscrowEth: "0.04",
      totalReceivedEth: "1.8",
      totalInvestedEth: "0.91",
      reservedPairBuybackEth: "0.11",
      fundingState: "Funded · example",
      poolPearsPerApple: "99750",
    }),
    history: simulated(points),
    a2p: simulated({
      usd: "0.0025",
      address: "demo",
      basis: "Simulated A2P price",
    }),
    ratio: simulated({
      timestamp: date,
      aaplPriceUsd: "250",
      a2pPriceUsd: "0.0025",
      pearsPerApple: "100000",
    }),
    change24h: null,
    holderCount: simulated(384),
  };
}
export function demoTreasury(config: Config) {
  return {
    address: null as string | null,
    balances: simulated<import("./types").Balance[]>([
      {
        symbol: "ETH",
        address: null,
        amount: "1.25",
        decimals: 18,
        valueUsd: "3750",
      },
      {
        symbol: "A2P",
        address: null,
        amount: "800000",
        decimals: 18,
        valueUsd: "2000",
      },
      {
        symbol: "AAPL",
        address: config.aaplAddress,
        amount: "12",
        decimals: 18,
        valueUsd: "3000",
      },
      {
        symbol: "USDC",
        address: null,
        amount: "2500",
        decimals: 6,
        valueUsd: "2500",
      },
    ]),
    totalValueUsd: "11250",
    knownValueUsd: "11250",
    unpriced: 0,
    transactions: simulated([
      {
        hash: "demo-example-1",
        blockNumber: "0",
        timestamp: new Date().toISOString(),
        from: "demo",
        to: "demo",
        amount: "2500",
        symbol: "USDC",
        direction: "in" as const,
        category: "Illustrative contribution · simulated",
      },
      {
        hash: "demo-example-2",
        blockNumber: "0",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        from: "demo",
        to: "demo",
        amount: "15000",
        symbol: "A2P",
        direction: "out" as const,
        category: "Illustrative allocation · simulated",
      },
    ]),
    prices: [] as Observation<import("./types").Price>[],
  };
}
