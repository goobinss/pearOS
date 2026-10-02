# Public Pear Ratio API

`GET /api/pear-ratio` uses the same server service as Home and Terminal. It returns mode (demo/live), status (ok/stale/unavailable/unconfigured), ratio or null, quote currency, unitBasis, source, observedAt, fetchedAt, reason and separate project/reference observations. Each source observation includes its own data/status/source/observation time/fetch time/reason. Decimal values are strings.

`ratio = referenceAssetPrice / projectTokenPrice`: whole project tokens per one whole Robinhood AAPL Stock Token. Apple shares and other issuers' tokens are different references and are not substituted. Live inputs must be positive, have matching quote currencies and whole-token units, be no older than two minutes, and be within 60 seconds of each other. Invalid inputs withhold the ratio. A stale result keeps the original observation time and shows null for the calculated ratio.

Demo responses are deterministic and explicitly mode:demo, with DEMO sources. Live mode never falls back to fixtures. Missing verified adapters yield precise unavailable/unconfigured states. Invalid application configuration returns HTTP 503 with a safe unavailable response.

Live HTTP responses use no-store; deterministic demo responses use max-age=30/s-maxage=60. Pear Core deduplicates provider reads for 60 seconds within a process without advancing source timestamps. No history or financial write API exists. The optional SDK's `Pear.getRatio()` reads this public frontend endpoint with an 8-second timeout and no credentials. Missing/authentication/content-mismatched backends return safe 503 responses.

## Treasury ledger

`GET /api/treasury` returns the same `TreasuryView` used by the Treasury page: mode, address, explorer URL, source-stamped balances, outstanding commitments, payout records/checks and budget policies/receipts/rounds/disbursements/accounts. All financial amounts remain decimal strings. It is GET-only; POST returns 405. Valid reads return 200 with `Cache-Control: no-store`; invalid configuration or reviewed content returns a safe 503 without upstream details.

Accounts stay separate by exact asset identity. Owner-reviewed receipt evidence is distinct from RPC-verified transfer settlement. Pending or unverified transfers continue to consume their reservation. Demo holds no real receipt records or funded proposal account. The optional SDK still supports only the ratio endpoint.
