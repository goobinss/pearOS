# Run PearOS and Pear Core on Vercel

Use **two Vercel projects**. PearOS is the public website; private Pear Core is the authenticated read-only backend. The browser never receives the API credential. No database, wallet service or always-running process is required.

## Build settings

Connect Vercel's GitHub integration to both repositories, retaining Pear Core's private visibility.

| Setting                     | Pear Core                        | PearOS                                                                                            |
| --------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------- |
| Repository                  | `goobinss/pear-core` (private)   | `goobinss/pearOS` (public)                                                                        |
| Framework                   | Next.js                          | Next.js                                                                                           |
| Root directory              | `services/api`                   | `apps/web`                                                                                        |
| Include source outside root | Enabled                          | Enabled                                                                                           |
| Node.js                     | 22.x                             | 22.x                                                                                              |
| Install command             | `pnpm install --frozen-lockfile` | `pnpm install --frozen-lockfile`                                                                  |
| Build command               | `pnpm build`                     | `pnpm exec node --conditions=react-server --import tsx scripts/validate-content.ts && pnpm build` |
| Output directory            | Default                          | Default                                                                                           |

Set `ENABLE_EXPERIMENTAL_COREPACK=1` on both projects so the root packageManager selects pnpm 11.25.0. Confirm the actual pnpm and Node versions in build logs. Local checks use Node 22.23.3; Vercel manages available Node 22.x patches and cannot pin an exact patch. These settings are prepared and checked locally; a successful Vercel deployment must still be checked on Vercel.

## Backend configuration

Create a random server credential once on your own machine:

```sh
node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("hex") + "\n")'
```

Store the value in Vercel, never Git. Set these on Pear Core:

```dotenv
ENABLE_EXPERIMENTAL_COREPACK=1
DATA_MODE=live
PROJECT_NAME=PEAR
PROJECT_SYMBOL=A2P
CORE_READ_TOKEN=<the generated credential>
CONTENT_GITHUB_OWNER=goobinss
CONTENT_GITHUB_REPO=pearOS
CONTENT_REVISION=<full reviewed pearOS commit SHA>
GITHUB_OWNER=goobinss
GITHUB_REPO=pearOS
```

Find the public revision with `git -C /path/to/pearOS rev-parse HEAD`. Push that commit before configuring the backend. Do not use `main`: content must be pinned to a full SHA. Pear Core fetches only the eight official JSON files at that revision and validates the entire financial registry. No duplicated live ledger belongs in the backend repository.

Deploy Pear Core first and use its stable production origin, for example `https://pear-core-your-team.vercel.app`, or attach `api.yourdomain.com`. `/v1/health` returns service/version health without the bearer credential; it does not prove chain/provider readiness. `/v1/dashboard` must return 401 without a credential and 200 with the correct credential and valid pinned records.

If Vercel Deployment Protection challenges requests to this backend origin, create a backend **Protection Bypass for Automation** secret and put that value in the frontend's `BACKEND_VERCEL_BYPASS`. The frontend sends it as `x-vercel-protection-bypass`; application bearer authentication is still required. Do not expose either value in NEXT_PUBLIC variables or browser code.

## Frontend configuration and domain

Set these on PearOS, substituting the backend's actual origin and hostname:

```dotenv
ENABLE_EXPERIMENTAL_COREPACK=1
DATA_MODE=live
PROJECT_NAME=PEAR
PROJECT_SYMBOL=A2P
GITHUB_OWNER=goobinss
GITHUB_REPO=pearOS
BACKEND_URL=https://pear-core-your-team.vercel.app
BACKEND_ALLOWED_HOSTS=pear-core-your-team.vercel.app
BACKEND_READ_TOKEN=<same value as CORE_READ_TOKEN>
# Only when backend host protection needs it:
BACKEND_VERCEL_BYPASS=<backend automation bypass secret>
```

Redeploy after changes. Match both projects' GitHub owner/repository values. Production and Preview need separate credentials/configuration; use `DATA_MODE=demo` and no backend secrets for untrusted/public pull-request previews.

Test the frontend's vercel.app URL, then open **Settings → Domains**, add your domain plus `www`, choose the primary hostname and set the exact DNS records Vercel displays at your registrar. Keep existing mail records. Wait for a valid domain configuration and HTTPS certificate. The API subdomain is optional; a backend vercel.app origin works.

On the real domain, check all four pages, mobile navigation, proposal downloads, filters and the public `/api/treasury` and `/api/pear-ratio`. A connected backend with pending token data returns explicit missing data. An authentication/content/source failure displays a notice, withholds financial records and returns 503 from the public JSON APIs. Live mode never substitutes examples.

From a trusted local shell with the frontend environment configured, run `pnpm check:launch --community`. The full check additionally requires fresh treasury data and verified live prices, which remain pending until a real adapter is implemented.

## Publishing content updates

Review the JSON changes, run both repositories' checks, and validate the new local records using Pear Core's `OFFICIAL_CONTENT_DIR` in development. Push the reviewed public commit, update backend `CONTENT_REVISION` to its full SHA and redeploy the backend; align the frontend release. During different-content deployment windows financial data is intentionally withheld. Use preview releases to check the pair before promoting production. Code-only public updates need not change the pinned revision if all eight content files are identical.

## Enable chain and price data

Provider settings belong only in Pear Core: CHAIN_ID, NETWORK_TYPE, RPC_URL, RPC_ALLOWED_HOSTS, CHAIN_VERIFIED_AT, PAYMENT_CONFIRMATIONS, EXPLORER_BASE_URL, PROJECT_TOKEN_ADDRESS/DECIMALS, REFERENCE_TOKEN_ADDRESS/DECIMALS, NATIVE_SYMBOL/DECIMALS and TREASURY_ADDRESS. Fill only independently verified values. GitHub provider credentials are optional server-only GITHUB_READ_TOKEN.

Current on-chain reads support EVM native/ERC-20 assets. The live price adapter still needs verified provider evidence and implementation in Pear Core. Financial programs additionally need genuine settled receipts and approved funded terms. All launch and payment actions stay manual.

Official references: [build/Corepack configuration](https://vercel.com/docs/builds/configure-a-build), [workspace source access](https://vercel.com/docs/monorepos/monorepo-faq), [Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [environment variables](https://vercel.com/docs/environment-variables), [domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [protection bypass header](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).
