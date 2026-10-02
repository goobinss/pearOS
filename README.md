# PearOS

Public frontend for **PEAR**, ticker **A2P**. Exactly four pages: Home, Terminal, Build Pear and Treasury.

PearOS renders the interface and owns reviewed public content. The private **Pear Core** repository runs the read-only API: GitHub/RPC reads, exact accounting, funding validation and payment verification. The browser never receives its server credential. No wallet, swap, signing, sending or token deployment is included.

## Run locally

Use Node **22.23.3** and pnpm **11.25.0**:

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
DATA_MODE=demo pnpm dev
```

Open http://localhost:3000. Demo fixtures are synthetic and work without a backend. Live mode is the default and never falls back to demo.

For the complete local system, copy `apps/web/.env.example` to a new `apps/web/.env.local` only if one does not already exist. Set live mode, the local backend origin and a matching server credential, then start Pear Core on port 3001 as described in its README. Preserve existing local configuration.

## Deploy and maintain

Follow [the two-project Vercel guide](docs/DEPLOYMENT.md). The private backend is required for live financial data and paid tasks; missing or mismatched backend records are visibly withheld. The community site still renders planning requests during an outage.

Official policies, receipts, tasks and manual payment records live in `apps/web/content`. Pear Core loads them from a pinned public commit and validates them before serving data. A content digest ensures both releases use the same records. [CONTENT.md](docs/CONTENT.md) explains editing and release order; [ARCHITECTURE.md](docs/ARCHITECTURE.md) maps the code.

The proposed 35/25/20/10/10 split is inactive. No receipt-funded reward or support round is active. Network, token contract, fee rights and live price integration remain pending; see [LAUNCH.md](docs/LAUNCH.md).

## Checks

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
pnpm --dir apps/web exec playwright install chromium
pnpm test:e2e
pnpm audit --audit-level high
```

Browser tests cover four pages at desktop/mobile widths, accessibility, filters, offline demo, missing live data, backend connection and credential boundaries. Screenshots and historical review reports are local ignored artifacts. Financial/domain tests live in Pear Core.

`pnpm check:launch --community` requires an authenticated backend with matching reviewed content. `pnpm check:launch` also requires fresh treasury reads and verified prices. Neither command deploys or transacts.

## License

Preserve [Apache-2.0](LICENSE) and [third-party attribution](THIRD_PARTY_NOTICES.md). The existing pear mascot is owner-supplied artwork; the code license does not establish artwork or trademark rights. Contributions require no token purchase or holding; see [CONTRIBUTING.md](CONTRIBUTING.md).
