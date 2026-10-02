# Public boundary

PearOS contains presentation, public contracts, reviewed content and an authenticated server-only HTTP client for Pear Core. Private code is never imported, bundled or mirrored here. Live financial validation and provider reads belong to Pear Core.

The browser only talks to PearOS; no backend credential, RPC URL, GitHub token or Vercel bypass secret is returned in public config or logs. Official task/reward/payment terms remain in `apps/web/content`. Pear Core reads a reviewed commit and verifies the same content digest before its results are used.

Both services are GET-only. Signing, sending, claims, swaps and token deployment remain manual. Local environment files, screenshot archives and preserved unused references are ignored. Run boundary checks and scan working sources plus reachable history before publishing; never rewrite history to hide a leak.
