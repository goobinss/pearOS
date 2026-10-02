# Integration status

PEAR is the name; A2P is the ticker. No launch platform or network is selected by the ticker.

The two-repository API uses authenticated server-to-server reads and a pinned public content revision. See [DEPLOYMENT.md](docs/DEPLOYMENT.md). Provider configuration and financial parsers belong in private Pear Core.

The standard read-only EVM/native/ERC-20 treasury and direct-transfer verifier is implemented. The actual chain, RPC, explorer, contract identities, decimals, treasury and confirmation policy still need authoritative verification. Other network families need their own adapter.

The live ratio provider is intentionally unavailable. Pair.trade/Pons/AAPL market compatibility and actual quote endpoints, schema, whole-token units and original observation times must be verified before implementing an adapter. `MARKET_URL` alone cannot enable prices. No substitutes, network defaults or funded rewards are inferred.

Before token promotion, verify the actual launch platform/mode, supply, fee entitlement and recipient, claim/cost rules, real treasury reads and the public domain. Actual receipts and approved published terms are required for rewards. All signing and sending happen outside these repositories.
