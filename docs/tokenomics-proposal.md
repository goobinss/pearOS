# PearOS tokenomics proposal

**Status: working proposal for owner and legal review. This is not an active reward program or a launch configuration.** The owner confirmed **PEAR** as the token name and **A2P** as the ticker on 2026-10-01. Network, contract, supply, launch configuration, fee entitlement and funded budget remain unverified. A2P is a ticker, not a launch platform. Keep these terms out of public-facing promises until each item is verified and the owner publishes an approved policy.

## Purpose

Use project funds that are actually received to support useful contributions, recognize sustained community participation, pay essential operating costs, and keep a reserve. The proposal rewards work and participation; merely holding a token does not create a guaranteed payment, yield, redemption right, or claim on treasury assets.

## Proposed allocation of net receipts

Apply these percentages to **net, settled project receipts** that the project is entitled to control. Do not apply them to token market capitalization, trading volume, token supply, locked liquidity, unclaimed fees, or an estimated launch value.

| Allocation                     |    Share | Use                                                                                                                                                                                                                                          |
| ------------------------------ | -------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contributor rewards            |      35% | Pre-approved bounties for accepted code, design, research, documentation, moderation, and community work. Publish the exact asset, network, amount, scope, and acceptance criteria before work starts.                                       |
| Holder and contributor support |      25% | A discretionary, capped program for people who both participate in PearOS and demonstrate sustained community support. Holding may be one eligibility signal alongside completed contributions; it does not guarantee a payment or a return. |
| Operations                     |      20% | Hosting, security review, tooling, legal/accounting advice, and other documented project expenses.                                                                                                                                           |
| Product and ecosystem          |      10% | Audits, integrations, educational materials, and other owner-approved work that improves PearOS.                                                                                                                                             |
| Reserve                        |      10% | Uncommitted contingency for future project costs. Keep it visible as reserved, not as available rewards.                                                                                                                                     |
| **Total**                      | **100%** |                                                                                                                                                                                                                                              |

Percentages are a proposed budget policy, not automatic contract splits. Revisit them after observing actual receipts and costs. Any change should be dated, explained, and published before applying it to future receipts; never retroactively change a reward that was already approved.

## How to make holding support meaningful

Use the 25% support allocation for periodic, capped rounds rather than promising an ongoing dividend. For each round, publish the budget, eligibility window, evidence used, review date, maximum per participant, and payment status before submissions open. Consider a modest holding-duration signal together with a meaningful accepted contribution, with a cap so a large balance cannot dominate the pool. Publish the methodology and aggregate results, and provide a review path for mistakes.

Anyone can contribute without buying or holding a token. A holder-only requirement must not block ordinary task participation or make an approved bounty dependent on continued ownership. Do not describe this program as staking, passive income, guaranteed rewards, or profit sharing.

## What counts as receipts

Count funds only after the owner has verified that they were received, settled, and are available to the project under the applicable launch configuration. Record the source, asset identity, network, exact decimal amount, observation/settlement reference, date, and the amount assigned to each bucket. Keep amounts in their original asset denomination; do not infer equivalence across assets or networks.

Before launch, confirm in the actual Pair.trade interface and authoritative launch records:

- which launch mode and fee policy are selected;
- who controls and can claim each fee or other receipt;
- the exact paired assets, network, token identity, and payout destination;
- any launch, protocol, routing, or claim costs and the order in which they are deducted;
- whether the project can change the policy after launch, and what is immutable.

Do not treat initial liquidity, a developer purchase, a displayed market value, or a third-party estimate as project income. Do not assume the project receives trading fees just because a token is launched. If no eligible receipts arrive, the reward budget is zero.

## Approval and settlement

An allocation in this document is only a budget ceiling. It does not fund or approve a particular bounty. For each task, publish its scope and exact reward only after reserving enough received funds. A maintainer reviews the deliverable and approves it; payment is a separate manual action. Record a payment as verified only after the existing Treasury process confirms the exact transfer on the stated network.

Maintain a public ledger showing, for each reporting period, opening reserve, verified receipts, amounts assigned to each bucket, approved commitments, verified settlements, and closing reserve. Keep personal recipient details to the minimum needed and obtain contributor consent before publishing them.

## Release gates for the implementation agent

1. Treat this file as a proposal only. Do not create live bounty or payout records from these percentages.
2. Do not add wallet connection, signing, swapping, deployment, claims, or automated distribution code. All signing and sending remain manual and outside this repository.
3. Preserve the separation between planned budgets, approved work, commitments, and verified settlements in Treasury.
4. Keep unknown fee receipts unavailable in live mode; never substitute demo values or infer a Pair.trade configuration.
5. Before making holder-based eligibility public, have the owner review the final mechanism with qualified legal and tax advisers for the relevant jurisdictions.
6. Promote any approved public bounty and payout terms into `apps/web/content`, consistent with `CONTRIBUTING.md`. Documentation alone does not activate an offer.

## Decisions still needed

- Confirmed: name PEAR and ticker A2P. Still needed: chain, contract, supply and launch mode.
- Verified Pair.trade fee policy, recipient, payout asset, and claim mechanics.
- Whether the proposed percentages fit actual operating needs and likely receipts.
- The holder-and-contributor round criteria, cadence, cap, review process, and eligible jurisdictions.
- Owner approval and legal/tax review before publication.

## Implementation record

The public app reads the proposal from `apps/web/content/budget-policies.json`. Owner-reviewed receipts, exact per-asset accounting, reservation checks, manual disbursement verification and reviewed capped-round schemas are implemented. Financial records and support rounds remain empty; no program is activated by this document. See [LAUNCH.md](LAUNCH.md) for implementation choices and [CONTENT.md](CONTENT.md) for the maintainer workflow.
