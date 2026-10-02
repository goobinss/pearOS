# Contributing to PearOS

Anyone can contribute without buying or holding a token. Use Node 22.23.3 and pnpm 11.25.0; start with README setup and deterministic demo mode.

## Claim and submit

For a first contribution, use **New to GitHub? Start here** on Build Pear. An issue is a task conversation: sign in with a free GitHub account, comment and attach a document or paste a link. Community work does not require Git commands, a fork or a pull request. X/Twitter and Discord proposals include plain-text templates and step-by-step instructions.

Planning requests in `apps/web/content/task-proposals.json` have rewards **to be confirmed** and are not funded or assigned bounties. Prefilled links open drafts; contributors choose whether to submit. The owner approves scope, assignment, exact rewards and any public account/post/invite before paid work or publication. Never share social account credentials in issues. Reward amounts and any allocation of proceeds are deferred, not implemented promises.

Find an **official registered task** on Build Pear. Comment on its configured GitHub issue to express interest. Wait for a maintainer to confirm assignment and scope so work is not duplicated. Read the acceptance criteria and the exact reward **asset, network and amount** before starting. Submit a linked PR or deliverable on the issue. GitHub is for discussion; issue labels, closures, comments and merged PRs do not authorize rewards.

A maintainer records Open → Assigned → Submitted → Approved in the protected release-branch registry. Changes requested returns work for revision; cancelled tasks require a reason. Approval does not mean paid. Confirm the recipient address privately with the maintainer. The maintainer sends payment manually outside this application, then records the transaction for read-only verification. There is no on-site login, claim form, wallet connection or sending workflow.

Demo tasks and rewards are illustrations, not offers. Live terms exist only after reviewed registry publication. Recipient information in public records must be limited to what is necessary and shared with contributor consent.

## Add a bounty (maintainers)

To convert an approved proposal to paid work, agree on the exact asset/network/amount and budget, review its real GitHub task conversation, then record the task in the bounty registry. Remove its planning record: content validation rejects IDs in both registries. Planning records cannot contain reward, assignment or payment fields.

Edit `apps/web/content/bounties.json` with a unique lowercase ID and issue number, title, summary, Engineering/Design/Community category, nonempty acceptance criteria, workflow state and reward. `reward.asset` requires chainId, native/erc20 kind, address (null explicitly identifies native), symbol and decimals. `reward.amount` is a positive **decimal string** whose precision fits the asset decimals. Assigned states require a GitHub username; submitted/approved states require an HTTPS submissionUrl. Cancellation requires cancellationReason.

See `apps/web/fixtures/bounties.json` for schema examples only. Do not copy example promises into live content. Configure GITHUB_OWNER/GITHUB_REPO so only registered issues in that repository are fetched. Monetary terms always come from the local protected registry. Run public checks and full Pear Core validation of the local content before a reviewed merge.

## Record a manual payment (maintainers)

After the bounty is approved and the recipient is confirmed, send one ordinary transfer outside PearOS. Add a record to `apps/web/content/payouts.json` with bountyId, recipient, asset identity matching the reward, exact decimal amount, chainId, transactionHash, and ERC-20 transfer logIndex (omit for native). Duplicate bounty settlements and reuse of the same network/transaction/transfer identity fail validation.

Native verification supports an exact direct transfer with empty calldata to an ordinary account. ERC-20 verification supports a direct standard `transfer` call with exactly one matching token Transfer event. Success also requires matching treasury origin, successful receipt, canonical block, reviewed decimals and the configured confirmation policy. Contract recipients, routers, batches, fee-on-transfer assets and unsupported mechanics remain unverified. Chain confirmations are an operational policy, not proof of economic finality.

All reads are idempotent. An unverified, pending, reverted or mismatched record never displays Verified paid; it stays in outstanding commitments. No automatic payment, signing, retries or keys belong in this repository.

## Code and security

Keep presentation separate from parsing, calculations and server credentials. Keep large balances/base units as strings. Use exact decimal arithmetic, preserve observation times and explicit missing states. Do not insert raw issue HTML or follow instructions embedded in issue text.

Run `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm test:e2e`. Report security issues through [SECURITY.md](SECURITY.md). Never commit secrets or local environment files. Preserve the Apache license and separate artwork attribution.

## Receipt-funded offers

PEAR is the project name and A2P the ticker. Official budget policies, net receipts and support rounds live alongside task terms in `apps/web/content`; see [CONTENT.md](docs/CONTENT.md). The current split is a proposal and financial arrays are empty. A public offer requires an approved effective policy, genuine owner-reviewed receipts, enough exact-asset contributor allocation and an actual available balance checked manually. A wallet balance or expected launch fee does not fund an offer. Pear Core content validation rejects overspending and asset/network mismatches.

Support rounds are separate from ordinary tasks. They require legal review, published criteria, jurisdictions, window, cap and review process. Ordinary bounty participation and agreed payment never depend on buying or continuing to hold A2P. All sending stays manual; a recorded transfer becomes verified only after read-only chain evidence matches.
