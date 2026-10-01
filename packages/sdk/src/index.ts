import type {
  Balance, Dashboard, Observation, PairProject, RatioPoint, RatioResponse,
  Transfer, Treasury,
} from "@pearos/shared-types";

export type PearOptions = { apiUrl: string; fetch?: typeof fetch };
export class PearApiError extends Error {
  constructor(public readonly status: number) {
    super(`Pear API request failed (${status})`);
    this.name = "PearApiError";
  }
}
/** Read-only client for the intentionally public Pear Core v1 API. */
export class Pear {
  private readonly base: URL;
  private readonly fetcher: typeof fetch;
  constructor(options: PearOptions) {
    const base = new URL(options.apiUrl);
    if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname)))
      throw new Error("Pear API URL must use HTTPS (HTTP is allowed on localhost)");
    if (base.username || base.password || base.search || base.hash)
      throw new Error("Pear API URL must not contain credentials, query or fragment");
    this.base = new URL(base.toString().replace(/\/?$/, "/"));
    this.fetcher = options.fetch || fetch;
  }
  private async get<T>(path: string): Promise<T> {
    const response = await this.fetcher(new URL(path, this.base), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new PearApiError(response.status);
    return response.json() as Promise<T>;
  }
  getStats() { return this.get<RatioResponse>("v1/pear-ratio"); }
  getActivity() { return this.get<Observation<Transfer[]>>("v1/transactions"); }
  getProjects() { return this.get<Observation<PairProject>>("v1/projects"); }
  getDashboard() { return this.get<Dashboard>("v1/dashboard"); }
  getTreasury() { return this.get<Treasury>("v1/treasury"); }
  getHistory() { return this.get<Observation<RatioPoint[]>>("v1/history"); }
  getWallet(address: string) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new Error("Invalid wallet address");
    return this.get<Observation<Balance[]>>(`v1/wallet?address=${encodeURIComponent(address)}`);
  }
}
export type { Dashboard, Treasury, RatioResponse, Observation, Transfer, PairProject } from "@pearos/shared-types";
