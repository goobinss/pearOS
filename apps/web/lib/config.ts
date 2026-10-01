import type { PublicConfig } from "@pearos/shared-types";
export type Config = PublicConfig & { apiUrl: string | null };
function publicUrl(value: string | undefined, fallback: string): string {
  const url = new URL(value || fallback);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))
    throw new Error("Public URL must use HTTPS or local HTTP");
  if (url.username || url.password || url.search || url.hash)
    throw new Error("Public URL must not contain credentials, query or fragment");
  return url.toString().replace(/\/$/, "");
}
export function readConfig(env: Record<string, string | undefined> = process.env): Config {
  const chainId = Number(env.ROBINHOOD_CHAIN_ID || "4663");
  if (![4663, 46630].includes(chainId)) throw new Error("Invalid public chain ID");
  const apiUrl = env.PEAR_PUBLIC_API_URL?.trim() || null;
  return {
    chainId,
    rpcUrl: publicUrl(env.ROBINHOOD_PUBLIC_RPC_URL, `https://rpc.${chainId === 4663 ? "mainnet" : "testnet"}.chain.robinhood.com`),
    explorerUrl: publicUrl(env.ROBINHOOD_EXPLORER_URL, chainId === 4663 ? "https://robinhoodchain.blockscout.com" : "https://explorer.testnet.chain.robinhood.com"),
    a2pAddress: env.A2P_ADDRESS || null,
    aaplAddress: env.AAPL_ADDRESS || (chainId === 4663 ? "0xaf3d76f1834a1d425780943c99ea8a608f8a93f9" : null),
    demo: env.DEMO_MODE === "true",
    holderMinimum: env.HOLDER_MIN_A2P || "1",
    apiUrl: apiUrl ? publicUrl(apiUrl, apiUrl) : null,
  };
}
export function publicConfig(config: Config): PublicConfig {
  return { chainId: config.chainId, rpcUrl: config.rpcUrl, explorerUrl: config.explorerUrl, a2pAddress: config.a2pAddress, aaplAddress: config.aaplAddress, demo: config.demo, holderMinimum: config.holderMinimum };
}
export type { PublicConfig } from "@pearos/shared-types";
