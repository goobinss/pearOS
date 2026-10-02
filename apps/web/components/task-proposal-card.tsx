import { ArrowUpRight, Download, Users } from "lucide-react";
import type { TaskProposal } from "@/lib/types";
import { proposalConversationUrl } from "@/lib/task-proposals";
export function TaskProposalCard({
  task: t,
  githubUrl,
}: {
  task: TaskProposal;
  githubUrl: string | null;
}) {
  const conversation = proposalConversationUrl(t, githubUrl);
  return (
    <article className="bounty-card community-task-card task-card" id={t.id}>
      <div className="section-heading">
        <span className="bounty-icon">
          <Users size={20} aria-hidden="true" />
        </span>
        <span className="status workflow-planning">Planning</span>
      </div>
      <span className="eyebrow">{t.category} / Owner review required</span>
      <h3>{t.title}</h3>
      <p>{t.summary}</p>
      <p className="small">No coding needed · Start with a document</p>
      <details className="criteria task-instructions">
        <summary>How to help, step by step</summary>
        <ol>
          {t.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <h4>What to deliver</h4>
        <ul>
          {t.deliverables.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <h4>How the owner reviews it</h4>
        <ul>
          {t.acceptanceCriteria.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="approval-note">{t.approvalNote}</p>
      </details>
      <div className="bounty-footer">
        <span className="small">Reward</span>
        <strong>To be confirmed</strong>
        <span className="small muted">
          The owner confirms the amount and asset before paid work begins. A
          proposal is not an assigned bounty.
        </span>
      </div>
      <div className="bounty-actions">
        <a href={`/task-templates/${t.id}.txt`} download className="text-link">
          Download proposal template <Download size={15} aria-hidden="true" />
        </a>
        {conversation ? (
          <a
            href={conversation}
            className="button primary"
            target="_blank"
            rel="noreferrer"
          >
            Open proposal on GitHub{" "}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : (
          <span className="small muted">
            The task repository must be configured before proposals can be sent.
          </span>
        )}
      </div>
      <p className="small muted">
        Opens a draft conversation. Sign in, add your introduction and click
        Submit new issue. No code or pull request needed.
      </p>
    </article>
  );
}
