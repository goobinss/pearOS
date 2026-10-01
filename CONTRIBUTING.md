# Contributing to PearOS

## Start

Use Node.js 22.13+ and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, copy `apps/web/.env.example` to `apps/web/.env.local`, then run `pnpm dev`. Demo mode works without Pear Core.

## Bounties

Look for issues labeled `bounty` and comment on the issue to claim one. Wait for a maintainer to confirm scope and any reward in writing before work begins. A proposed bounty or reward shown in the app is not a payment promise. Every public issue should be completable using this repository, mock data, and the documented public API.

## Pull requests

Keep PRs focused. Include the linked issue, a short description, screenshots for visible UI changes, and the commands you ran. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before submitting. Add focused tests for SDK behavior and public UI logic when behavior changes.

Use TypeScript, keep response decimals as strings, preserve source timestamps and unavailable states, and use the shared types package for public API contracts. Keep backend calls inside `packages/sdk` or the web app's allowlisted read-only API proxy. Do not import Pear Core modules.

Never commit secrets, `.env.local`, private keys, credentials, or internal service URLs. Use placeholder values in `.env.example`. Report security concerns privately as described in [SECURITY.md](SECURITY.md).
