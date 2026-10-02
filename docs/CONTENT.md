# Reviewed content and receipt accounting

All official records live in `apps/web/content`. JSON edits need maintainer review and both repositories' release checks. Pear Core performs full financial validation before serving a pinned public revision; `pnpm validate:content` checks the public file shape and digest. GitHub issues provide task context; issue edits or closure cannot change amounts, approve work or verify payment. Never paste credentials or private eligibility evidence into these records.

| File                   | What to record                                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `project.json`         | Official name PEAR and ticker A2P. Neither proves a network or contract.                                                    |
| `budget-policies.json` | Dated, versioned percentages and approval/review status. Initial v1 remains a proposal.                                     |
| `receipts.json`        | Net settled project receipts, actual asset identity, source time, costs and owner-reviewed settlement/entitlement evidence. |
| `bounties.json`        | Fixed, funded task terms and work state.                                                                                    |
| `payouts.json`         | One manually sent transfer per approved bounty.                                                                             |
| `support-rounds.json`  | Approved round budget, per-participant cap, rules, methodology, dates, jurisdictions and review path. Initially empty.      |
| `disbursements.json`   | Approved, manually sent operations/ecosystem/reserve/support transfers; verified separately from their recording.           |
| `task-proposals.json`  | Planning requests with no reward promise or assignment.                                                                     |

## Publish a policy

Keep the proposed 35/25/20/10/10 split until the owner approves it against actual operating needs. `status: "approved"` requires `approvedAt` in UTC before the `effectiveFrom` date starts. Choose a future effective date when approving during a day. Holder-related spending also requires `legalReviewedAt`; that field records completed review, it does not perform it. Do not set either field merely to pass validation.

Keep an approved version and its percentages intact. Append a new ID and later effective date for a policy change; the latest approved policy effective at the receipt's original `receivedAt` applies. Existing receipt allocations and reward terms keep their original policy. Publication is manual; percentages never create a bounty, collect fees or send money.

## Record receipts

Each receipt has `id`, `policyId`, `asset`, `grossAmount`, `costs`, `netAmount`, `receivedAt`, `source`, `evidenceUrl`, `entitlementUrl`, `reviewedAt` and `reviewedBy`. Use UTC source timestamps and exact decimal strings; net must equal gross minus documented costs in the **same asset**. A native asset has a null address; an ERC-20 asset needs its actual contract, chain, symbol and reviewed decimals. Synthetic schema and funding examples are tested in private Pear Core.

The owner must verify settlement, availability and the project's entitlement before recording income. Evidence links must be public credential-free HTTPS URLs. Count a receipt only once. Initial liquidity, purchases, token supply, market value, trading volume, unknown fees and unclaimed fees are excluded. Cross-asset costs need separately reviewed accounting; never invent an exchange rate to subtract them.

The UI labels receipts as owner-reviewed records. It does not label them RPC-verified or imply that holding a token creates a claim. A ledger entry cannot prove legal entitlement, contributor consent or an honest source; maintainer review remains necessary.

## Reserve and pay

The validator floors the first four allocations to the asset's smallest unit and assigns every remainder to reserve. It adds receipts by exact chain/kind/contract identity and checks metadata consistency. The cumulative ledger starts with zero at inception; opening allocation + received allocations − commitments − verified settlements = closing uncommitted allocation. Take a dated monthly report from this ledger and its original evidence; verification fetch time is never a settlement date.

Publishing any non-cancelled bounty reserves its whole reward from contributor receipts. A paid bounty still consumes its original allocation; successful verification moves it from committed to verified paid. Recording an unverified, reverted or mismatched payment does not release the reservation. A cancelled task releases its reservation and needs a cancellation reason. Never cancel completed work to evade an agreed reward.

The content validator rejects unfunded offers and asset/network/decimals mismatches. It cannot prove that wallet funds remain available after unrecorded withdrawals. Before publishing an offer, also check the actual treasury balance, all existing obligations and exact available asset units manually. Follow [CONTRIBUTING.md](../CONTRIBUTING.md) for assignment, approval, recipient consent and payment verification.

Non-bounty transfers include `id`, `bucket`, `purpose`, `approvedAt` and the same exact transfer fields used in payouts (`recipient`, `asset`, `amount`, `chainId`, `transactionHash`, plus ERC-20 `logIndex`). Use `transactionHash: null` and omit `logIndex` for an approved commitment before manual payment. Add the real hash/log index after sending; never invent one to record approval. Contributor transfers belong in the bounty ledger. A transaction cannot appear in both ledgers. Payments exceeding their bucket are rejected. Failed records keep their reservation until a reviewed correction; the application never retries a transfer.

## Support rounds

No holder criteria or round is active by default. A round needs an approved and legally reviewed policy, exact asset/budget/cap, approval before opening, eligibility window, later review date, published methodology, eligible jurisdictions and HTTPS submission/review path. Support payments need `roundId`, the exact round asset, approval after its review date and a cumulative recipient amount within the cap. Manual review must ensure one participant does not bypass the cap with multiple addresses.

The full round budget is reserved once. Its transfers move reserved funds into verified settlement without allocating the same money twice. Unspent funds stay reserved until a reviewed close-out. Every round has `closedAt: null` and `releasedAmount: "0"` initially. After the review window, publish the original UTC closing date and exact unused amount. Approved awards, including those with no transaction yet, plus released funds must equal the original round budget. The release returns only unused funds to the support allocation; unpaid awards remain committed. A closed round cannot approve new awards. No money moves when closing a record. Ordinary bounties do not require token ownership and their approved rewards cannot depend on continued holding.

All live receipt, bounty, payout, disbursement and round arrays start empty. Demo records live only in `fixtures`; synthetic holdings never fund official content.

## Release the reviewed records

Validate local records in Pear Core using OFFICIAL_CONTENT_DIR during development and run `pnpm check:launch --community`. Push the reviewed public commit, update backend CONTENT_REVISION to its full SHA, and align both deployments. Different-content releases withhold financial data until their digests match. See [DEPLOYMENT.md](DEPLOYMENT.md).
