import { divide, positive, percentageChange } from "./numbers";
import type { Observation, Price, RatioPoint } from "./types";

function unavailable<T>(source: string, message: string): Observation<T> {
  return { data: null, status: "unavailable", source, observedAt: null, fetchedAt: new Date().toISOString(), message };
}
export function calculatePearRatio(aaplUsd: string, a2pUsd: string): string {
  if (!positive(aaplUsd) || !positive(a2pUsd))
    throw new Error("Both prices must be positive");
  return divide(aaplUsd, a2pUsd);
}
export function deriveRatio(
  aapl: Observation<Price>,
  a2p: Observation<Price>,
): Observation<RatioPoint> {
  if (!aapl.data || !a2p.data || !aapl.observedAt || !a2p.observedAt)
    return unavailable(
      "AAPL reference ÷ A2P indexed price",
      "Both timestamped USD prices are needed",
    );
  const skew = Math.abs(
    Date.parse(aapl.observedAt) - Date.parse(a2p.observedAt),
  );
  if (skew > 300_000)
    return unavailable(
      "Pear Ratio",
      "Price observations are more than five minutes apart",
    );
  const timestamp = new Date(
    Math.min(Date.parse(aapl.observedAt), Date.parse(a2p.observedAt)),
  ).toISOString();
  const stale =
    [aapl.status, a2p.status].includes("stale") ||
    Date.now() - Date.parse(timestamp) > 120_000;
  return {
    data: {
      timestamp,
      pearsPerApple: calculatePearRatio(aapl.data.usd, a2p.data.usd),
      aaplPriceUsd: aapl.data.usd,
      a2pPriceUsd: a2p.data.usd,
    },
    status: stale
      ? "stale"
      : [aapl.status, a2p.status].includes("demo")
        ? "demo"
        : [aapl.status, a2p.status].includes("cached")
          ? "cached"
          : "live",
    source: "AAPL token-equivalent reference USD ÷ A2P indexed USD",
    observedAt: timestamp,
    fetchedAt: new Date().toISOString(),
    ...(stale
      ? { message: "Reference is stale; excluded from new history samples" }
      : {}),
  };
}
export function ratioChange24h(
  points: RatioPoint[],
  current: RatioPoint,
): string | null {
  const target = Date.parse(current.timestamp) - 86_400_000;
  const closest = points.reduce<RatioPoint | null>(
    (best, point) =>
      !best ||
      Math.abs(Date.parse(point.timestamp) - target) <
        Math.abs(Date.parse(best.timestamp) - target)
        ? point
        : best,
    null,
  );
  return closest && Math.abs(Date.parse(closest.timestamp) - target) <= 900_000
    ? percentageChange(current.pearsPerApple, closest.pearsPerApple)
    : null;
}
