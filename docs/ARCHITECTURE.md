# Two-repository architecture

The browser requests PearOS on the public domain. PearOS's Next.js server makes an authenticated GET to Pear Core. Pear Core loads reviewed public content at a pinned commit, validates financial records, reads configured providers and returns a versioned public data contract.

| Repository / location                     | Responsibility                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| PearOS `apps/web/app`, `components`       | Four pages and two public GET-only JSON endpoints.                                      |
| PearOS `apps/web/lib/backend.ts`          | Server-only authenticated backend client, request bounds and safe missing states.       |
| PearOS `apps/web/content`                 | Authoritative reviewed identity, policy, receipts, tasks, rounds and payment records.   |
| PearOS `apps/web/fixtures`, `lib/demo.ts` | Explicit offline illustrations; never a live fallback.                                  |
| PearOS `packages/shared-types`            | Public wire contract v1.                                                                |
| PearOS `packages/sdk`                     | Optional client for the public ratio API.                                               |
| PearOS `packages/ui`                      | Small existing UI primitives with attribution.                                          |
| Pear Core `services/api/lib`              | Provider reads, exact amounts, financial validation, allocations and settlement checks. |
| Pear Core `services/api/app/v1`           | Authenticated dashboard, bounties, treasury and ratio GETs; credential-free health GET. |
| Pear Core `services/api/tests`            | Financial, parser, authentication and pinned-content regression checks.                 |

PearOS does not import private source or hold RPC/GitHub provider credentials. Its backend credential and optional Vercel protection bypass stay server-only. Destination hosts are configured explicitly, redirects are rejected, and bodies/timeouts are bounded. React memoizes one dashboard read within each render; live public APIs use no-store.

Pear Core checks bearer authentication before reading content or providers. It accepts official records only from a 40-character commit SHA in the configured public repository. SHA-256 over the eight ordered JSON files must match the frontend. Branch names and issue edits cannot change official terms. Different content produces a 409/missing state until the release is aligned.

Source times and exact decimal strings remain intact. Receipt records are owner attestations, holdings are balances, approval reserves work, and only matching confirmed chain evidence establishes settlement. All payment and launch actions remain manual outside both repositories. No database or background worker is required.
