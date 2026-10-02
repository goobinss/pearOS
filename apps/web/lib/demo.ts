import "server-only";
import market from "../fixtures/market.json";
import holdings from "../fixtures/treasury.json";
import tasks from "../fixtures/bounties.json";
import payments from "../fixtures/payouts.json";
import policies from "../content/budget-policies.json";
import type {
  Balance,
  Bounty,
  BountyView,
  Payout,
  PublicConfig,
  RatioResponse,
  TreasuryView,
} from "./types";

/** Offline illustrations, never a response to failed live reads. */
export function demoDashboard(config: PublicConfig) {
  const observation = (
    data: RatioResponse["observations"]["project"]["data"],
  ) => ({
    data,
    status: "ok" as const,
    source: "DEMO · deterministic synthetic fixture",
    observedAt: market.observedAt,
    fetchedAt: market.observedAt,
    reason: "Illustration only; not a market quote",
  });
  const ratio: RatioResponse = {
    mode: "demo",
    status: "ok",
    ratio: "100000",
    currency: "USD",
    unitBasis: "Whole project tokens per one whole AAPL Stock Token",
    source: "Reference price ÷ project price",
    observedAt: market.observedAt,
    fetchedAt: market.observedAt,
    reason: null,
    observations: {
      project: observation({
        ...market.project,
        assetLabel: `${config.symbol} · synthetic token`,
        basis: "one-whole-token",
      }),
      reference: observation({ ...market.reference, basis: "one-whole-token" }),
    },
  };
  const payouts = payments as Payout[];
  const bounties: BountyView[] = (tasks as Bounty[]).map((task) => ({
    ...task,
    mode: "demo",
    issue: {
      data: null,
      status: "unconfigured",
      source: "DEMO · sample task",
      observedAt: null,
      fetchedAt: market.observedAt,
      reason: "Example only; no claimable GitHub issue",
    },
    payment: payouts.some((payment) => payment.bountyId === task.id)
      ? {
          status: "unverified",
          reason: "DEMO · simulated record, never verified on a network",
          checkedAt: null,
        }
      : null,
  }));
  const treasury: TreasuryView = {
    mode: "demo",
    address: null,
    explorerUrl: null,
    balances: {
      data: holdings.balances as Balance[],
      status: "ok",
      source: "DEMO · deterministic synthetic balances",
      observedAt: holdings.observedAt,
      fetchedAt: holdings.observedAt,
      reason: "No real wallet or funding represented",
    },
    commitments: holdings.commitments as TreasuryView["commitments"],
    payouts: payouts.map((record) => ({
      record,
      check: bounties.find((task) => task.id === record.bountyId)!.payment!,
    })),
    budget: {
      policies: policies as TreasuryView["budget"]["policies"],
      receipts: [],
      accounts: [],
      disbursements: [],
      rounds: [],
    },
  };
  return { config, ratio, bounties, treasury, connected: false, reason: null };
}
