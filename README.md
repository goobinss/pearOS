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

### Data Structures
`Observation<T>` includes `data`, `status`, `source`, `observedAt`, and `fetchedAt`.
- **Status**: Indicates the validity of the `data`. Always check `if (res.status === 'live')` before processing `data`.
- **Amounts**: Represented as decimal strings (e.g., `"10.50"`) to prevent precision loss common with floating-point numbers.
- **Timestamps**: ISO 8601 strings indicating when the state was observed vs. when the request was completed.

### Example Responses

**Live Observation:**
```json
{ "data": { "value": "1250.75" }, "status": "live", "source": "mainnet", "observedAt": "2023-10-27T10:00:00Z", "fetchedAt": "2023-10-27T10:00:01Z" }
```

**Unavailable Observation:**
```json
{ "data": null, "status": "unavailable", "source": "mainnet", "observedAt": null, "fetchedAt": "2023-10-27T10:00:05Z" }
```

**503 Error:**
```json
{ "error": "Service Unavailable", "message": "Downstream node sync in progress" }
```

### SDK Usage
```typescript
const stats = await getStats();
if (stats.status === 'live') {
  console.log('Current Ratio:', stats.data.ratio);
}

const activity = await getActivity();
if (activity.status === 'live') {
  activity.data.forEach(tx => console.log(tx.amount));
}
```

The Pear Ratio is AAPL token-equivalent USD divided by A2P USD. It is a reference comparison, not a trade quote or redemption promise. The SDK makes GET requests only and sends no credentials.