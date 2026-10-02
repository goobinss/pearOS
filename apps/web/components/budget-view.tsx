import type { BudgetView as BudgetData, DataMode } from "@/lib/types";
import { budgetBuckets } from "@/lib/budget-buckets";
import { assetKey } from "@/lib/assets";
import { amount, dateTime } from "./format";

export function BudgetView({
  data,
  mode,
}: {
  data: BudgetData;
  mode: DataMode;
}) {
  const policy = [...data.policies].sort((a, b) =>
    b.effectiveFrom.localeCompare(a.effectiveFrom),
  )[0];
  if (!policy)
    return (
      <section className="budget-section">
        <h2>Budget data unavailable</h2>
        <p>
          Reviewed financial records could not be loaded. No available reward
          amount is displayed.
        </p>
      </section>
    );
  return (
    <section
      className="budget-section"
      id="budget-policy"
      aria-labelledby="budget-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">NET RECEIPTS / BUDGET POLICY</p>
          <h2 id="budget-title">Useful work. Accountable funds.</h2>
        </div>
        <span className="status">
          {policy.status === "proposal"
            ? "PROPOSAL · NOT ACTIVE"
            : "APPROVED BUDGET POLICY"}
        </span>
      </div>
      <p className="muted">
        {policy.status === "proposal"
          ? "The proposed split below needs owner approval. The support program also needs legal review. No reward round is open."
          : "This policy sets budget ceilings for net, settled receipts the project is entitled to control. Each bounty and support round needs its own published terms."}{" "}
        Holding A2P does not guarantee a payment, yield or claim on treasury
        funds.
      </p>
      <div className="allocation-grid">
        {budgetBuckets.map(({ id, label, purpose }) => (
          <article className="allocation-card" key={id}>
            <strong className="allocation-percent">
              {policy.allocations.find((a) => a.bucket === id)!.percent}%
            </strong>
            <h3>{label}</h3>
            <p>{purpose}</p>
          </article>
        ))}
      </div>
      <p className="small muted">
        Policy {policy.id} ·{" "}
        {policy.status === "proposal"
          ? "Proposed effective date"
          : "Effective date"}
        : {policy.effectiveFrom}. Market value, volume, token supply, liquidity
        and unclaimed fees are excluded. Asset-unit rounding remains in reserve.
        These percentages never send funds.
      </p>
      {!data.receipts.length ? (
        <div className="budget-empty">
          <h3>No reviewed receipts. No funded reward budget.</h3>
          <p>
            {mode === "demo"
              ? "Demo holdings and example bounties do not fund this real proposal."
              : "Eligible fee receipts are unconfigured. There are no receipt records or active reward rounds."}
          </p>
        </div>
      ) : (
        <>
          <div className="section-heading">
            <h3>Receipt and allocation ledger</h3>
            <span className="small muted">Cumulative · per asset</span>
          </div>
          <p className="small muted">
            Receipt entries are owner-reviewed attestations with settlement and
            entitlement evidence. This application does not independently verify
            revenue entitlement. Closing uncommitted amounts exclude reserved
            commitments and verified settlements; wallet balances remain
            separate.
          </p>
          {data.accounts.map((account) => (
            <div className="budget-account" key={assetKey(account.asset)}>
              <h3>
                {account.asset.symbol} · {amount(account.netReceipts, 36)} net
                receipts
              </h3>
              <p className="small muted">
                Chain {account.asset.chainId} ·{" "}
                {account.asset.address || "native"} · Opening allocation: 0
                (from inception)
              </p>
              <div className="budget-table-wrap">
                <table className="budget-table">
                  <caption className="sr-only">
                    Budget for {account.asset.symbol} on chain{" "}
                    {account.asset.chainId}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Allocation</th>
                      <th scope="col">Assigned</th>
                      <th scope="col">Committed</th>
                      <th scope="col">Verified paid</th>
                      <th scope="col">Uncommitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {account.buckets.map((b) => (
                      <tr key={b.bucket}>
                        <th scope="row">
                          {
                            budgetBuckets.find(
                              (bucket) => bucket.id === b.bucket,
                            )!.label
                          }
                        </th>
                        {[
                          b.allocated,
                          b.committed,
                          b.verifiedSettled,
                          b.remaining,
                        ].map((value, index) => (
                          <td className="mono" key={index}>
                            {amount(value, 36)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <details className="criteria receipt-evidence">
            <summary>Receipt sources and original dates</summary>
            {data.receipts.map((receipt) => (
              <article key={receipt.id}>
                <h4>
                  {receipt.id} · {receipt.source}
                </h4>
                <p>
                  {amount(receipt.grossAmount, 36)} gross −{" "}
                  {amount(receipt.costs, 36)} costs ={" "}
                  {amount(receipt.netAmount, 36)} {receipt.asset.symbol} net ·
                  Chain {receipt.asset.chainId} ·{" "}
                  {receipt.asset.address || "native"}
                </p>
                <p>
                  Received: {dateTime(receipt.receivedAt)} · Reviewed:{" "}
                  {dateTime(receipt.reviewedAt)} · Policy: {receipt.policyId}
                </p>
                <a
                  className="text-link"
                  href={receipt.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Settlement evidence
                </a>
                {" · "}
                <a
                  className="text-link"
                  href={receipt.entitlementUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Project entitlement evidence
                </a>
              </article>
            ))}
          </details>
        </>
      )}
      {data.disbursements.length > 0 && (
        <div className="budget-spending">
          <h3>Other commitments and payments</h3>
          {data.disbursements.map(({ record: payment, check }) => (
            <article className="commitment" key={payment.id}>
              <span>
                {payment.purpose} ·{" "}
                {budgetBuckets.find((b) => b.id === payment.bucket)!.label}
              </span>
              <strong className="mono">
                {amount(payment.amount, 36)} {payment.asset.symbol}
              </strong>
              <p className="small muted">
                {check.status === "verified"
                  ? "Verified paid"
                  : `Recorded — ${check.status}`}{" "}
                · {check.reason} · Chain {payment.chainId} ·{" "}
                {payment.asset.address || "native"}
              </p>
              <p className="small muted">
                Recipient: {payment.recipient} · Transaction:{" "}
                {payment.transactionHash || "Awaiting manual payment"} ·
                Approved: {dateTime(payment.approvedAt)}
              </p>
            </article>
          ))}
        </div>
      )}
      {data.rounds.length > 0 && (
        <div className="support-rounds">
          <h3>Published support rounds</h3>
          {data.rounds.map((round) => (
            <article className="panel" key={round.id}>
              <h4>{round.id}</h4>
              <p className="small muted">
                {round.closedAt
                  ? `Closed: ${dateTime(round.closedAt)} · Returned to support allocation: ${amount(round.releasedAmount, 36)} ${round.asset.symbol}`
                  : "Approved round · funds reserved through manual close-out"}
              </p>
              <p>
                Budget: {amount(round.budget, 36)} {round.asset.symbol} ·
                Maximum per participant: {amount(round.capPerParticipant, 36)}{" "}
                {round.asset.symbol}
              </p>
              <p className="small muted">
                Chain {round.asset.chainId} · {round.asset.address || "native"}{" "}
                · Policy {round.policyId}
              </p>
              <p className="small muted">
                Window: {dateTime(round.opensAt)} to {dateTime(round.closesAt)}{" "}
                · Review: {dateTime(round.reviewAt)}
              </p>
              <ul>
                {round.eligibility.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <p>{round.methodology}</p>
              <p className="small muted">
                Eligible jurisdictions: {round.jurisdictions.join(", ")}. Manual
                review; submitting evidence does not guarantee an award.
              </p>
              <a
                href={round.reviewUrl}
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                Round record and review
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
