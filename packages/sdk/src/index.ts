import type { RatioResponse } from "@pearos/shared-types";
export type PearOptions = { apiUrl: string; fetch?: typeof fetch };
export class PearApiError extends Error {
  constructor(public readonly status: number) {
    super(`PearOS API request failed (${status})`);
    this.name = "PearApiError";
  }
}
/** Optional read-only client for this application's public ratio endpoint. */
export class Pear {
  private readonly base: URL;
  private readonly fetcher: typeof fetch;
  constructor(options: PearOptions) {
    const u = new URL(options.apiUrl);
    if (
      u.protocol !== "https:" &&
      !(
        u.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(u.hostname)
      )
    )
      throw new Error("API URL must use HTTPS or local HTTP");
    if (u.username || u.password || u.search || u.hash || u.pathname !== "/")
      throw new Error("Supply a credential-free application origin");
    this.base = u;
    this.fetcher = options.fetch || fetch;
  }
  async getRatio(): Promise<RatioResponse> {
    const r = await this.fetcher(new URL("/api/pear-ratio", this.base), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new PearApiError(r.status);
    const value = await r.json();
    if (
      !["demo", "live"].includes(value.mode) ||
      !["ok", "stale", "unavailable", "unconfigured"].includes(value.status) ||
      (value.ratio !== null &&
        (typeof value.ratio !== "string" || !/^\d+(\.\d+)?$/.test(value.ratio)))
    )
      throw new Error("Invalid ratio response");
    return value;
  }
}
export type { RatioResponse } from "@pearos/shared-types";
