export type DataMode = "demo" | "live";
export type DataStatus = "ok" | "stale" | "unavailable" | "unconfigured";
export type Observation<T> = {
  data: T | null;
  status: DataStatus;
  source: string;
  observedAt: string | null;
  fetchedAt: string;
  reason: string | null;
};
export type Price = {
  amount: string;
  currency: string;
  basis: "one-whole-token";
  assetLabel: string;
};
export type RatioResponse = {
  mode: DataMode;
  status: DataStatus;
  ratio: string | null;
  currency: string | null;
  unitBasis: string;
  source: string;
  observedAt: string | null;
  fetchedAt: string;
  reason: string | null;
  observations: { project: Observation<Price>; reference: Observation<Price> };
};
export type Asset = {
  chainId: number;
  kind: "native" | "erc20";
  address: string | null;
  symbol: string;
  decimals: number;
};
export type Workflow =
  | "Open"
  | "Assigned"
  | "Submitted"
  | "Changes requested"
  | "Approved"
  | "Cancelled";
export type Bounty = {
  id: string;
  title: string;
  summary: string;
  category: "Engineering" | "Design" | "Community";
  issueNumber: number;
  acceptanceCriteria: string[];
  reward: { asset: Asset; amount: string };
  state: Workflow;
  assignedTo?: string;
  submissionUrl?: string;
  cancellationReason?: string;
};
export type PaymentStatus =
  | "verified"
  | "pending"
  | "reverted"
  | "mismatched"
  | "unverified";
export type Payout = {
  bountyId: string;
  recipient: string;
  asset: Asset;
  amount: string;
  chainId: number;
  transactionHash: string;
  logIndex?: number;
};
export type PaymentCheck = {
  status: PaymentStatus;
  reason: string;
  checkedAt: string | null;
};
export type BountyView = Bounty & {
  mode: DataMode;
  issue: Observation<{ title: string; state: string; url: string }>;
  payment: PaymentCheck | null;
};
// Proposals have no promised reward or assignment. Reviewed paid work belongs
// in the bounty registry after the owner confirms its exact terms.
export type TaskProposal = {
  id: string;
  title: string;
  summary: string;
  category: "Engineering" | "Design" | "Community";
  state: "Planning";
  steps: string[];
  acceptanceCriteria: string[];
  deliverables: string[];
  approvalNote: string;
};
export type Balance = { asset: Asset; raw: string; amount: string };
export type Commitment = { asset: Asset; amount: string };
export type TreasuryView = {
  mode: DataMode;
  address: string | null;
  explorerUrl: string | null;
  balances: Observation<Balance[]>;
  commitments: Commitment[];
  payouts: { record: Payout; check: PaymentCheck }[];
  budget: BudgetView;
};

export type BudgetBucket =
  | "contributors"
  | "support"
  | "operations"
  | "ecosystem"
  | "reserve";
export type BudgetPolicy = {
  id: string;
  status: "proposal" | "approved";
  effectiveFrom: string;
  approvedAt: string | null;
  legalReviewedAt: string | null;
  allocations: { bucket: BudgetBucket; percent: number }[];
};

/** Owner-reviewed net receipts. An entry is an attestation, not an RPC verification. */
export type TreasuryReceipt = {
  id: string;
  policyId: string;
  asset: Asset;
  grossAmount: string;
  costs: string;
  netAmount: string;
  receivedAt: string;
  source: string;
  evidenceUrl: string;
  entitlementUrl: string;
  reviewedAt: string;
  reviewedBy: string;
};

/** Non-bounty spending is approved and sent manually, then checked read-only. */
export type BudgetDisbursement = Omit<
  Payout,
  "bountyId" | "transactionHash"
> & {
  id: string;
  bucket: Exclude<BudgetBucket, "contributors">;
  purpose: string;
  approvedAt: string;
  roundId?: string;
  transactionHash: string | null;
};

export type SupportRound = {
  id: string;
  policyId: string;
  asset: Asset;
  budget: string;
  capPerParticipant: string;
  opensAt: string;
  closesAt: string;
  reviewAt: string;
  approvedAt: string;
  eligibility: string[];
  methodology: string;
  jurisdictions: string[];
  reviewUrl: string;
  closedAt: string | null;
  releasedAmount: string;
};

export type BudgetAccount = {
  asset: Asset;
  netReceipts: string;
  buckets: {
    bucket: BudgetBucket;
    allocated: string;
    committed: string;
    verifiedSettled: string;
    remaining: string;
  }[];
};
export type BudgetView = {
  policies: BudgetPolicy[];
  receipts: TreasuryReceipt[];
  accounts: BudgetAccount[];
  disbursements: { record: BudgetDisbursement; check: PaymentCheck }[];
  rounds: SupportRound[];
};

export type PublicConfig = {
  mode: DataMode;
  symbol: string;
  projectName: string;
  chainId: number | null;
  networkType: "mainnet" | "testnet" | null;
  explorerUrl: string | null;
  projectAddress: string | null;
  referenceAddress: string | null;
  treasuryAddress: string | null;
  marketUrl: string | null;
  githubUrl: string | null;
};
export type BackendDashboard = {
  version: 1;
  contentDigest: string;
  contentRevision: string;
  config: PublicConfig;
  ratio: RatioResponse;
  bounties: BountyView[];
  treasury: TreasuryView;
};
