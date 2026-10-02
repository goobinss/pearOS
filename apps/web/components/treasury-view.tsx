import type { TreasuryView as TreasuryData } from "@/lib/types";
import { assetKey } from "@/lib/assets";
import { Address } from "./address";
import { SourceNote, EmptyState } from "./data-display";
import { amount, shortAddress, dateTime } from "./format";
import { ArrowUpRight } from "lucide-react";
import { BudgetView } from "./budget-view";
export function TreasuryView({ data }: { data: TreasuryData }) {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">03 / PUBLIC RECORD</p>
        <h1>
          Nothing behind
          <br />
          the curtain.
        </h1>
        <p>Holdings, commitments and recorded payments. Kept separate.</p>
      </div>
      <section className="treasury-hero">
        <div>
          <p className="eyebrow">
            {data.mode === "demo"
              ? "DEMO / SYNTHETIC TREASURY"
              : "PUBLIC TREASURY"}
          </p>
          <h2>A clear view of the funds.</h2>
          <p>Wallet holdings are not escrow or an earmarked bounty budget.</p>
        </div>
        <div className="treasury-address">
          <span className="small">Treasury address</span>
          <Address
            value={data.address}
            explorer={data.explorerUrl}
            label="Treasury address"
          />
          {data.mode === "demo" && (
            <p className="small">No real wallet represented.</p>
          )}
        </div>
      </section>
      <div className="two-columns">
        <section className="panel">
          <div className="section-heading">
            <h2>Wallet holdings</h2>
            <span className="status">
              {data.mode === "demo" ? "DEMO" : "READ ONLY"}
            </span>
          </div>
          {data.balances.data?.length ? (
            <div className="holdings-list">
              {data.balances.data.map((b) => (
                <div className="holding" key={assetKey(b.asset)}>
                  <div>
                    <strong>{b.asset.symbol}</strong>
                    <span className="small muted">
                      {data.mode === "demo"
                        ? "Synthetic asset"
                        : "Chain " +
                          b.asset.chainId +
                          " · " +
                          (b.asset.address || "native")}
                    </span>
                  </div>
                  <strong className="mono" title={b.amount}>
                    {amount(b.amount, 36)}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Balances are not available yet."
              description={
                data.balances.reason ||
                "Configure the treasury and supported asset allowlist."
              }
            />
          )}
          <SourceNote value={data.balances} mode={data.mode} />
          <p className="small muted">
            USD valuation unavailable: reliable asset quotes have not been
            verified.
          </p>
        </section>
        <section className="panel commitments-panel">
          <div className="section-heading">
            <h2>Outstanding commitments</h2>
            <span className="eyebrow">BY ASSET</span>
          </div>
          <p className="muted">
            Published fixed rewards, including approved work awaiting verified
            settlement. These amounts are separate from wallet holdings.
          </p>
          {data.commitments.length ? (
            data.commitments.map((c) => (
              <div className="commitment" key={assetKey(c.asset)}>
                <span>
                  {data.mode === "demo" ? "DEMO · " : ""}
                  {c.asset.symbol}
                </span>
                <strong className="mono">{amount(c.amount, 36)}</strong>
                <span className="small muted">
                  {data.mode === "demo"
                    ? "Example rewards only"
                    : "Chain " +
                      c.asset.chainId +
                      " · " +
                      (c.asset.address || "native")}
                </span>
              </div>
            ))
          ) : (
            <p className="empty-inline">No outstanding bounty commitments.</p>
          )}
          <p className="small muted">
            Cancelled tasks and verified settlements are excluded. Different
            assets are never summed together.
          </p>
        </section>
      </div>
      <BudgetView data={data.budget} mode={data.mode} />
      <section className="ledger-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE PAYMENT LEDGER</p>
            <h2>Good work, on the record.</h2>
          </div>
          <span className="small muted">
            {data.payouts.length} recorded{" "}
            {data.payouts.length === 1 ? "payment" : "payments"}
          </span>
        </div>
        {data.payouts.length ? (
          <div className="ledger">
            <div className="ledger-head">
              <span>Task / recipient</span>
              <span>Exact amount</span>
              <span>Verification</span>
              <span>Transaction</span>
            </div>
            {data.payouts.map(({ record: p, check: v }) => (
              <article className="ledger-row" key={p.bountyId}>
                <div>
                  <strong>{p.bountyId}</strong>
                  <span className="mono small" title={p.recipient}>
                    {data.mode === "demo"
                      ? "DEMO · synthetic recipient"
                      : shortAddress(p.recipient)}
                  </span>
                </div>
                <div>
                  <strong className="mono">
                    {amount(p.amount, 36)} {p.asset.symbol}
                  </strong>
                  <span className="small muted">
                    {data.mode === "demo"
                      ? "DEMO · synthetic asset"
                      : "Chain " + p.chainId}
                  </span>
                </div>
                <div>
                  <span className={`status payment-${v.status}`}>
                    {data.mode === "demo" ? "DEMO · " : ""}
                    {v.status === "verified"
                      ? "Verified paid"
                      : v.status === "pending"
                        ? "Pending"
                        : "Recorded — " + v.status}
                  </span>
                  <p className="small muted">{v.reason}</p>
                  <span className="small muted">
                    {v.checkedAt
                      ? "Checked: " + dateTime(v.checkedAt)
                      : "No network verification"}
                  </span>
                </div>
                <div>
                  {data.mode === "live" && data.explorerUrl ? (
                    <a
                      href={`${data.explorerUrl}/tx/${p.transactionHash}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Explore payment for ${p.bountyId}`}
                      className="text-link"
                    >
                      {shortAddress(p.transactionHash)}{" "}
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span className="small muted">
                      Example · no transaction link
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="The ledger starts with real work."
            description="After a maintainer approves a task and manually sends payment, a reviewed record appears here. Successful transfer verification is required for “Verified paid”."
          />
        )}
        <p className="small muted ledger-note">
          All payments are sent manually outside PearOS. This application cannot
          sign, send or retry transactions.
        </p>
      </section>
    </>
  );
}
