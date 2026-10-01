# Pear Core public API v1

Base URL: the HTTPS URL configured by the operator, for example `https://api.pear2apple.xyz`. The example domain is illustrative until a service is deployed. These endpoints are read-only JSON responses.

| Method | Path | SDK method | Response |
| --- | --- | --- | --- |
| GET | `/v1/pear-ratio` | `getStats()` | `RatioResponse` |
| GET | `/v1/transactions` | `getActivity()` | `Observation<Transfer[]>` |
| GET | `/v1/projects` | `getProjects()` | `Observation<PairProject>` |
| GET | `/v1/dashboard` | `getDashboard()` | `Dashboard` |
| GET | `/v1/treasury` | `getTreasury()` | `Treasury` |
| GET | `/v1/history` | `getHistory()` | `Observation<RatioPoint[]>` |
| GET | `/v1/wallet?address=0x...` | `getWallet(address)` | `Observation<Balance[]>` |

`Observation<T>` includes `data`, `status`, `source`, `observedAt`, and `fetchedAt`. `data` can be `null` even when the HTTP response is 200; inspect `status`. Monetary values are decimal strings. `live`, `cached`, `stale`, and `unavailable` describe source state. `demo` identifies simulated local examples. Timestamps are ISO 8601 strings. A 503 response means the API could not produce the normal response.

The Pear Ratio is AAPL token-equivalent USD divided by A2P USD. It is a reference comparison, not a trade quote or redemption promise. The SDK makes GET requests only and sends no credentials. The browser app uses its own `/api/*` routes to forward this allowlist to Pear Core, avoiding cross-origin setup for the site.
