# Repository boundary

```text
pearOS web / SDK  -- HTTPS GET /v1/* -->  Pear Core API
Pear Core may consume intentionally public contracts from pearOS.
pearOS never imports Pear Core code.
```

Public code includes the website, UI components, mock data, read-only SDK, response types, examples, docs, and public tests. The web app's `/api/*` proxy accepts only named read-only routes and forwards to the configured public API. Demo responses come from local mock data; wallet verification never uses mock balances.

Private Pear Core code owns RPC adapters, market source parsing, database access, authenticated snapshots, infrastructure, signing, execution, admin operations, and future anti-abuse rules. The public contract describes responses, not private storage or source selection.

Public endpoint changes should update `packages/shared-types`, `packages/sdk`, `docs/api.md`, and a corresponding public example or test. Backend changes should implement the contract without introducing a reverse dependency from PearOS into Pear Core.
