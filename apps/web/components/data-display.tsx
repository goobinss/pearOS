import type {
  DataMode,
  DataStatus,
  Observation,
  RatioResponse,
} from "@/lib/types";
import { amount, dateTime } from "./format";
export function Status({
  status,
  mode,
}: {
  status: DataStatus;
  mode?: DataMode;
}) {
  return (
    <span className={`status status-${status}`}>
      {mode === "demo" ? "DEMO · " : ""}
      {status === "ok"
        ? "Observed"
        : status === "unconfigured"
          ? "Unconfigured"
          : status === "stale"
            ? "Stale"
            : "Unavailable"}
    </span>
  );
}
export function SourceNote({
  value,
  mode,
}: {
  value: Observation<unknown>;
  mode: DataMode;
}) {
  return (
    <div className="source-note">
      <Status status={value.status} mode={mode} />
      <span>{value.source}</span>
      <span>
        Observed: {dateTime(value.observedAt)}
        <br />
        Fetched: {dateTime(value.fetchedAt)}
      </span>
      {value.reason && <p>{value.reason}</p>}
    </div>
  );
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-mark" aria-hidden="true">
        ∅
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
export function RatioPanel({
  ratio,
  symbol,
}: {
  ratio: RatioResponse;
  symbol: string;
}) {
  return (
    <section className="ratio-panel" aria-label="Pear Ratio">
      <div className="section-heading">
        <span className="eyebrow">THE PEAR RATIO</span>
        <Status status={ratio.status} mode={ratio.mode} />
      </div>
      {ratio.ratio ? (
        <>
          <p className="ratio-preamble">
            One whole AAPL Stock Token, expressed in pears.
          </p>
          <div className="ratio-value">
            {amount(ratio.ratio, 4)}
            <span>{symbol} / AAPL token</span>
          </div>
        </>
      ) : (
        <div className="ratio-coming">
          <h2>
            The first comparison
            <br />
            is coming.
          </h2>
          <p>{ratio.reason}</p>
        </div>
      )}
      <div className="ratio-formula">
        <span>Reference token price</span>
        <span aria-hidden="true">÷</span>
        <span>Project token price</span>
      </div>
      <div className="ratio-note">
        <span>
          {ratio.mode === "demo"
            ? "DEMO · synthetic illustration"
            : "Read-only comparison"}
        </span>
        <time dateTime={ratio.observedAt || undefined}>
          {dateTime(ratio.observedAt)}
        </time>
      </div>
      <p className="small">
        Whole-token units · matching quote currencies · source observations
        within 60 seconds. No redemption or executable trade implied.
      </p>
    </section>
  );
}
