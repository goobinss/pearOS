# PearOS contributor instructions

Use the existing Next.js application in `apps/web`; maintain exactly Home, Terminal, Build Pear and Treasury. Use Node 22.23.3 and pnpm 11.25.0.

Keep services server-only, source timestamps intact, exact decimal strings and demo fixtures separate. Live mode must never fall back to demo. Do not infer chain IDs, asset identity, market compatibility or funded rewards.

The owner requested two active repositories on 2026-10-01: PearOS renders the public frontend and Pear Core owns the read-only API, provider reads and financial validation. Connect them through authenticated server-only HTTP; never import private source. Official content remains in this repository and the backend reads a pinned public revision.

Official bounty and payout terms come from `apps/web/content`, not GitHub edits. Work approval is distinct from verified settlement. All signing and sending happen manually outside this repository. Never add wallet, swap, deployment or financial write code.

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm test:e2e`. Review screenshots before accepting visual changes. Preserve existing licenses, artwork and local uncommitted work. Do not commit local environment files or secrets; report leaks without rewriting history.
