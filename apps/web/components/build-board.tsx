import { ArrowUpRight, ArrowRight, Code2, Palette, Users } from "lucide-react";
import type { BountyView, TaskProposal } from "@/lib/types";
import { categories, workflows, buildFilterUrl } from "@/lib/build-filters";
import { TaskProposalCard } from "./task-proposal-card";
import { EmptyState } from "./data-display";
import { amount } from "./format";
export function BountyCard({ bounty: b }: { bounty: BountyView }) {
  const paid = b.payment?.status === "verified";
  const state = paid ? "Paid" : b.state;
  return (
    <article className="bounty-card task-card">
      <div className="section-heading">
        <span className="bounty-icon">
          {b.category === "Design" ? (
            <Palette size={20} />
          ) : b.category === "Community" ? (
            <Users size={20} />
          ) : (
            <Code2 size={20} />
          )}
        </span>
        <span
          className={`status workflow-${state.toLowerCase().replaceAll(" ", "-")}`}
        >
          {state}
        </span>
      </div>
      <span className="eyebrow">
        {b.mode === "demo" ? "DEMO / " : ""}
        {b.category}
      </span>
      <h3>{b.title}</h3>
      <p>{b.summary}</p>
      <details className="criteria">
        <summary>What to deliver</summary>
        <ul>
          {b.acceptanceCriteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </details>
      {b.assignedTo && (
        <p className="small muted">Assigned to @{b.assignedTo}</p>
      )}
      {b.cancellationReason && (
        <p className="small">Cancelled: {b.cancellationReason}</p>
      )}
      <div className="bounty-footer">
        <span className="small">
          {b.mode === "demo" ? "Example fixed reward" : "Fixed reward"}
        </span>
        <strong>
          {amount(b.reward.amount, 36)} {b.reward.asset.symbol}
        </strong>
        <span className="small muted">
          {b.mode === "demo"
            ? "Synthetic asset · no real reward"
            : "Chain " +
              b.reward.asset.chainId +
              " · " +
              (b.reward.asset.address || "native asset")}
        </span>
      </div>
      <div className="bounty-actions">
        {b.issue.data ? (
          <a
            className="text-link"
            href={b.issue.data.url}
            target="_blank"
            rel="noreferrer"
          >
            Open task conversation <ArrowUpRight size={15} />
          </a>
        ) : (
          <span className="small muted">
            {b.mode === "demo"
              ? "Example task · submissions disabled"
              : b.issue.reason}
          </span>
        )}
        {b.mode === "live" && b.submissionUrl && (
          <a
            href={b.submissionUrl}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            View submission <ArrowUpRight size={15} />
          </a>
        )}
      </div>
      {b.issue.data && (
        <p className="small muted">
          GitHub issue {b.issue.data.state}; official terms and approval come
          from the registry.
        </p>
      )}
      {b.payment ? (
        <div className="payment-note">
          <strong>
            {b.mode === "demo" ? "DEMO · " : ""}
            {paid
              ? "Verified paid"
              : b.payment.status === "pending"
                ? "Payment pending"
                : "Recorded payment — " + b.payment.status}
          </strong>
          <p>{b.payment.reason}</p>
        </div>
      ) : b.state === "Approved" ? (
        <p className="payment-note">Work approved · payment not recorded</p>
      ) : (
        <p className="small muted">Payment has not been recorded.</p>
      )}
    </article>
  );
}
export function BuildBoard({
  bounties,
  proposals,
  githubUrl,
  category,
  state,
}: {
  bounties: BountyView[];
  proposals: TaskProposal[];
  githubUrl: string | null;
  category: string;
  state: string;
}) {
  const filtered = bounties.filter(
    (b) =>
      (category === "All" || b.category === category) &&
      (state === "All" ||
        (b.payment?.status === "verified" ? "Paid" : b.state) === state),
  );
  const planned = proposals.filter(
    (t) =>
      (category === "All" || t.category === category) &&
      (state === "All" || state === t.state),
  );
  const count = filtered.length + planned.length;
  return (
    <>
      <div className="filter-bar">
        <nav className="filter-row" aria-label="Filter by category">
          {categories.map((c) => (
            <a
              className="filter-button"
              key={c}
              aria-current={category === c ? "true" : undefined}
              href={buildFilterUrl(c, state)}
            >
              {c}
            </a>
          ))}
        </nav>
        <form action="/build" method="get" className="state-filter">
          <input type="hidden" name="category" value={category} />
          <label htmlFor="task-status">Status</label>
          <select id="task-status" name="status" defaultValue={state}>
            {workflows.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="button secondary filter-apply" type="submit">
            Apply status
          </button>
        </form>
      </div>
      <p role="status" className="small muted result-count">
        {count} {count === 1 ? "task" : "tasks"}
        {category !== "All" ? ` in ${category}` : ""}
        {state !== "All" ? ` · ${state}` : ""}
        {(category !== "All" || state !== "All") && (
          <a className="text-link clear-filters" href="/build">
            Clear filters
          </a>
        )}
      </p>
      {count ? (
        <div className="bounty-grid">
          {planned.map((t) => (
            <TaskProposalCard key={t.id} task={t} githubUrl={githubUrl} />
          ))}
          {filtered.map((b) => (
            <BountyCard bounty={b} key={b.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            bounties.length || proposals.length
              ? "No tasks match these filters"
              : "Room for the first good idea."
          }
          description={
            bounties.length || proposals.length
              ? "Choose another category or status to explore the board."
              : "No official bounties have been published yet. Maintainers will add reviewed scope, acceptance criteria and fixed reward terms here."
          }
        />
      )}
      <div className="process-band">
        {[
          "Pick a task & introduce yourself",
          "Agree scope & exact reward",
          "Share your work for review",
          "Owner approval & manual payment",
        ].map((s, i) => (
          <div key={s}>
            <span className="step-number">0{i + 1}</span>
            <span>{s}</span>
            {i < 3 && <ArrowRight size={16} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </>
  );
}
