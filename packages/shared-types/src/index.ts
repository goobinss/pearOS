/** Public JSON contract returned by Pear Core v1. Decimal quantities are strings. */
export type Freshness = "live" | "cached" | "stale" | "unavailable" | "demo";
export interface Observation<T> {
  data: T | null;
  status: Freshness;
  source: string;
  observedAt: string | null;
  fetchedAt: string;
  freshUntil?: string;
  message?: string;
  blockNumber?: string;
}
export interface Price { usd: string; basis: string; address: string }
export interface RatioPoint {
  timestamp: string;
  pearsPerApple: string;
  aaplPriceUsd: string;
  a2pPriceUsd: string;
}
export interface Balance {
  symbol: string;
  address: string | null;
  amount: string | null;
  decimals: number | null;
  valueUsd: string | null;
  message?: string;
}
export interface Transfer {
  hash: string;
  logIndex?: number;
  blockHash?: string;
  tokenAddress?: string;
  blockNumber: string;
  timestamp: string;
  from: string;
  to: string;
  amount: string;
  symbol: string;
  direction: "in" | "out" | "self" | "transfer";
  category: string;
}
export interface StockAsset {
  address: string;
  name: string;
  symbol: string;
  multiplier: string;
  pendingMultiplier: string | null;
  pendingMultiplierEffectiveTime: string | null;
  status: string;
  tradingCapabilities: Record<string, unknown> | null;
}
export interface PairProject {
  address: string;
  name: string;
  symbol: string;
  creator: string;
  vault: string;
  curve: string;
  quote: string;
  version: number;
  priceUsd: string | null;
  liquidityUsd: string | null;
  volume24hUsd: string | null;
  valuationUsd: string | null;
  valuationBasis: string | null;
  priceUpdatedAt: string | null;
  priceStale: boolean;
}
export interface VaultState {
  address: string;
  creator: string;
  quote: string;
  pool: string | null;
  paused: boolean;
  ethBalance: string;
  a2pInventory: string;
  quoteInventory: string;
  reservedLiquidityEth: string;
  creatorClaimableEth: string;
  releasedEscrowEth: string;
  totalReceivedEth: string;
  totalInvestedEth: string;
  reservedPairBuybackEth: string;
  fundingState: string;
  poolPearsPerApple: string | null;
}
export interface PonsState {
  curve: string;
  deployer: string;
  feeRecipient: string;
  quote: string;
  quoteSymbol: string;
  phase: number;
  phaseLabel: string;
  creatorTaxBps: number;
  raised: string | null;
  threshold: string;
  progressPercent: string | null;
  marginalQuotePerA2p: string | null;
  readyToGraduate: boolean | null;
}
export interface Dashboard {
  mode: "live" | "demo";
  chainId: number;
  a2pAddress: string | null;
  aaplAddress: string | null;
  treasuryAddress: string | null;
  treasuryBalances: Observation<Balance[]>;
  explorerUrl: string;
  fetchedAt: string;
  stock: { metadata: Observation<StockAsset>; price: Observation<Price>; halted: boolean | null };
  project: Observation<PairProject>;
  readiness: {
    economics: Observation<{ launchConfigured: boolean; enabled: boolean; factory: string }>;
    asset: Observation<{ discovered: boolean; address: string | null; routeVerified: boolean }>;
  };
  pons: Observation<PonsState>;
  vault: Observation<VaultState>;
  history: Observation<RatioPoint[]>;
  a2p: Observation<Price>;
  ratio: Observation<RatioPoint>;
  change24h: string | null;
  holderCount: Observation<number>;
}
export interface Treasury {
  address: string | null;
  balances: Observation<Balance[]>;
  totalValueUsd: string | null;
  knownValueUsd: string;
  unpriced: number;
  transactions: Observation<Transfer[]>;
  prices: Observation<Price>[];
}
export interface RatioResponse {
  mode: "live" | "demo";
  status: Freshness;
  currency: "USD";
  aaplPrice: string | null;
  a2pPrice: string | null;
  pearsPerApple: string | null;
  timestamp: string | null;
  percentageChange24h: string | null;
  priceUnits: string;
  fetchedAt: string;
  message: string | null;
  sources: { aapl: Observation<Price>; a2p: Observation<Price> };
  assets: { chainId: number; aapl: string | null; a2p: string | null };
}
export interface PublicConfig {
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  a2pAddress: string | null;
  aaplAddress: string | null;
  demo: boolean;
  holderMinimum: string;
}
