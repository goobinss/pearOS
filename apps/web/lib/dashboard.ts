import { Pear } from "@pearos/sdk";
import type { Dashboard, Treasury, Observation, Transfer, RatioResponse, RatioPoint, Balance } from "@pearos/shared-types";
import { readConfig, type Config } from "./config";
import { demoDashboard, demoTreasury } from "./demo";
export type { Dashboard, Treasury } from "@pearos/shared-types";

function unavailable<T>(message: string): Observation<T> {
  return { data: null, status: "unavailable", source: "Pear Core public API", observedAt: null, fetchedAt: new Date().toISOString(), message };
}
export function unavailableDashboard(config: Config): Dashboard {
  const note = "Public API is not configured or is unavailable";
  return {
    mode: "live", chainId: config.chainId, a2pAddress: config.a2pAddress,
    aaplAddress: config.aaplAddress, treasuryAddress: null,
    treasuryBalances: unavailable<Balance[]>(note), explorerUrl: config.explorerUrl,
    fetchedAt: new Date().toISOString(),
    stock: { metadata: unavailable(note), price: unavailable(note), halted: null },
    project: unavailable(note),
    readiness: { economics: unavailable(note), asset: unavailable(note) },
    pons: unavailable(note), vault: unavailable(note), history: unavailable(note),
    a2p: unavailable(note), ratio: unavailable(note), change24h: null,
    holderCount: unavailable(note),
  };
}
export function unavailableTreasury(): Treasury {
  const note = "Public API is not configured or is unavailable";
  return { address: null, balances: unavailable(note), totalValueUsd: null, knownValueUsd: "0", unpriced: 4, transactions: unavailable(note), prices: [] };
}
function client(config: Config) { return config.apiUrl ? new Pear({ apiUrl: config.apiUrl }) : null; }
export async function getDashboard(): Promise<Dashboard> {
  const config = readConfig();
  if (config.demo) return demoDashboard(config);
  try { return await client(config)?.getDashboard() || unavailableDashboard(config); }
  catch { return unavailableDashboard(config); }
}
export async function getTreasury(): Promise<Treasury> {
  const config = readConfig();
  if (config.demo) return demoTreasury(config);
  try { return await client(config)?.getTreasury() || unavailableTreasury(); }
  catch { return unavailableTreasury(); }
}
export function ratioResponse(data: Dashboard): RatioResponse {
  return {
    mode: data.mode, status: data.ratio.status, currency: "USD",
    aaplPrice: data.stock.price.data?.usd || null,
    a2pPrice: data.a2p.data?.usd || null,
    pearsPerApple: data.ratio.data?.pearsPerApple || null,
    timestamp: data.ratio.observedAt,
    percentageChange24h: data.change24h,
    priceUnits: "Decimal strings; 1 whole raw AAPL Stock Token per X whole A2P tokens",
    fetchedAt: data.fetchedAt, message: data.ratio.message || null,
    sources: { aapl: data.stock.price, a2p: data.a2p },
    assets: { chainId: data.chainId, aapl: data.aaplAddress, a2p: data.a2pAddress },
  };
}
export async function getActivity(): Promise<Observation<Transfer[]>> {
  const config = readConfig();
  if (config.demo) return { data: [], status: "demo", source: "No simulated market transfers", observedAt: null, fetchedAt: new Date().toISOString() };
  try { return await client(config)?.getActivity() || unavailable("Public API is not configured"); }
  catch { return unavailable("Public API is unavailable"); }
}
export async function getHistory(): Promise<Observation<RatioPoint[]>> {
  return (await getDashboard()).history;
}
export async function getWallet(address: string): Promise<Observation<Balance[]>> {
  const config = readConfig();
  const api = client(config);
  if (!api) return unavailable("Wallet reads require the public API");
  try { return await api.getWallet(address); }
  catch { return unavailable("Wallet read is unavailable"); }
}
