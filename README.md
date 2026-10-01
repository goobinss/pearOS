# PearOS

PearOS is the public web app, UI kit, and read-only TypeScript SDK for the Apples to Pears community project. The Pear Ratio compares one whole AAPL Stock Token's USD reference with the A2P token's USD reference. These are separate assets; the ratio is not an executable swap quote.

The public app is useful without access to the private backend. Demo mode uses clearly labeled mock observations. Live mode reads only the documented Pear Core v1 HTTPS API. No transaction signing, trade execution, database access, or privileged API implementation lives here.

## Run locally

Use Node.js 22.13+ and pnpm 11.25.0:

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Open http://localhost:3000. The example enables `DEMO_MODE=true`, so the market and treasury examples are simulated and labeled. Wallet balances always require the real public API. To use a locally running Pear Core API, set `DEMO_MODE=false` and `PEAR_PUBLIC_API_URL=http://localhost:3001` in `apps/web/.env.local`. For a hosted API, use its verified HTTPS URL. Do not put credentials in the public app.

## Workspace

| Path | Purpose |
| --- | --- |
| `apps/web` | Next.js site, public API proxy, and browser interactions |
| `packages/sdk` | Read-only `Pear` client for `/v1` |
| `packages/shared-types` | Public JSON response types |
| `packages/ui` | Reusable public UI primitives |
| `examples` | SDK usage examples |
| `docs/api.md` | Public endpoint contract |
| `docs/repository-boundary.md` | Public/private dependency boundary |

Pear Core is developed separately. The dependency direction is Pear Core → public contracts. PearOS imports no private modules. The same-origin `/api/*` routes in the web app forward only an allowlist of read-only v1 endpoints; they hold no backend credentials.

## SDK

```ts
import { Pear } from "@pearos/sdk";
const pear = new Pear({ apiUrl: "https://api.pear2apple.xyz" });
const stats = await pear.getStats();
const activity = await pear.getActivity();
```

Set `apiUrl` to the actual deployed API address. The example domain is illustrative; this repository does not deploy the service. See [public API docs](docs/api.md) for all methods and response states.

## Contribute

Public issues and bounties are scoped to this repository. Rewards shown in the UI are proposals, not funded commitments. Read [CONTRIBUTING.md](CONTRIBUTING.md) before claiming a task, and report vulnerabilities using [SECURITY.md](SECURITY.md).

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## License and disclosures

Licensed under [Apache-2.0](LICENSE). See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

PearOS is independent and is not affiliated with or endorsed by Apple, Robinhood, Pair.trade, or Pons. A2P does not represent Apple equity, and pairing assets does not guarantee liquidity, tracking, value, yield, or returns. Studio cards are fictional community concepts.
