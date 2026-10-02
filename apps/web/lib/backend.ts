import "server-only";
import { cache } from "react";
import { readConfig, publicConfig, type Config } from "./config";
import { contentDigest, officialContent } from "./content";
import { demoDashboard } from "./demo";
import type { BackendDashboard, RatioResponse, TreasuryView } from "./types";

function unavailable(
  config: Config,
  status: "unconfigured" | "unavailable",
  reason: string,
) {
  const missing = {
    data: null,
    status,
    source: "Pear Core",
    observedAt: null,
    fetchedAt: new Date().toISOString(),
    reason,
  };
  const ratio: RatioResponse = {
    mode: "live",
    status,
    ratio: null,
    currency: null,
    unitBasis: "Whole project tokens per one whole AAPL Stock Token",
    source: "Pear Core",
    observedAt: null,
    fetchedAt: missing.fetchedAt,
    reason,
    observations: { project: missing, reference: missing },
  };
  const treasury: TreasuryView = {
    mode: "live",
    address: null,
    explorerUrl: null,
    balances: missing,
    commitments: [],
    payouts: [],
    budget: {
      policies: officialContent["budget-policies"].filter(
        (policy) => policy.status === "proposal",
      ) as TreasuryView["budget"]["policies"],
      receipts: [],
      accounts: [],
      disbursements: [],
      rounds: [],
    },
  };
  return {
    config: publicConfig(config),
    ratio,
    bounties: [],
    treasury,
    connected: false,
    reason,
  };
}
export async function loadDashboard(config = readConfig()) {
  if (config.mode === "demo") return demoDashboard(publicConfig(config));
  if (!config.backendUrl || !config.backendToken)
    return unavailable(
      config,
      "unconfigured",
      "Pear Core is not connected. Live financial data and paid tasks are withheld.",
    );
  try {
    const response = await fetch(`${config.backendUrl}/v1/dashboard`, {
      method: "GET",
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
      headers: {
        Authorization: `Bearer ${config.backendToken}`,
        "x-pear-content-digest": contentDigest,
        ...(config.protectionBypass
          ? { "x-vercel-protection-bypass": config.protectionBypass }
          : {}),
      },
    });
    if (
      !response.ok ||
      !response.headers.get("content-type")?.includes("application/json")
    )
      throw new Error("Unavailable backend");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 2_000_000) throw new Error("Backend response too large");
        chunks.push(value);
      }
    } finally {
      await reader.cancel();
    }
    const data = JSON.parse(
      Buffer.concat(chunks).toString("utf8"),
    ) as BackendDashboard;
    if (
      data.version !== 1 ||
      data.contentDigest !== contentDigest ||
      data.config?.mode !== "live" ||
      data.ratio?.mode !== "live" ||
      data.treasury?.mode !== "live" ||
      data.config.projectName !== config.projectName ||
      data.config.symbol !== config.symbol ||
      data.config.githubUrl !== config.githubUrl ||
      !Array.isArray(data.bounties) ||
      data.bounties.some((task) => task.mode !== "live") ||
      !Array.isArray(data.treasury.budget?.accounts)
    )
      throw new Error("Backend contract differs");
    for (const url of [
      data.config.explorerUrl,
      data.config.marketUrl,
      data.treasury.explorerUrl,
    ])
      if (
        url &&
        (new URL(url).protocol !== "https:" ||
          new URL(url).username ||
          new URL(url).password)
      )
        throw new Error("Unsafe backend link");
    for (const observation of [
      data.ratio.observations.project,
      data.ratio.observations.reference,
      data.treasury.balances,
    ])
      if (/DEMO|synthetic/i.test(observation.source))
        throw new Error("Synthetic live source");
    return {
      config: data.config,
      ratio: data.ratio,
      bounties: data.bounties,
      treasury: data.treasury,
      connected: true,
      reason: null,
    };
  } catch {
    return unavailable(
      config,
      "unavailable",
      "Pear Core could not provide matching reviewed data. Live financial data and paid tasks are withheld.",
    );
  }
}
export const getDashboard = cache(loadDashboard);
