import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Sprout,
  ScanLine,
  BookOpen,
} from "lucide-react";
import type { RatioResponse, BountyView, TaskProposal } from "@/lib/types";
import { TaskProposalCard } from "./task-proposal-card";
import type { PublicConfig } from "@/lib/config";
import { RatioPanel, SourceNote, EmptyState } from "./data-display";
import { BountyCard } from "./build-board";
import { Address } from "./address";
import { amount } from "./format";
export function HomeView({
  ratio,
  config,
  bounties,
  proposals,
}: {
  ratio: RatioResponse;
  config: PublicConfig;
  bounties: BountyView[];
  proposals: TaskProposal[];
}) {
  return (
    <>
      <div className="hero-grid">
        <section className="hero-copy">
          <p className="eyebrow">PEAR / {config.symbol} / BUILT TOGETHER</p>
          <h1>
            Finally, comparing
            <br />
            apples to <span>pears.</span>
          </h1>
          <p className="hero-description">
            A different perspective on community tokens.
            <br />
            Clear data. Useful contributions. A treasury you can inspect.
          </p>
          <div className="hero-actions">
            <Link href="/terminal" className="button primary">
              Explore PearOS <ArrowRight size={18} />
            </Link>
            <Link href="/build" className="button secondary">
              Find a bounty
            </Link>
          </div>
          <div className="mascot-signature">
            <Image
              src="/pear-mascot.png"
              width={112}
              height={140}
              alt="PearOS’s smiling pear mascot"
              priority
            />
            <span>
              A little different.
              <br />
              <strong>Open by design.</strong>
            </span>
          </div>
        </section>
        <RatioPanel ratio={ratio} symbol={config.symbol} />
      </div>
      <section className="intro-band">
        <div>
          <span className="eyebrow">01 / THE IDEA</span>
          <h2>
            Good things grow
            <br />
            when people build.
          </h2>
        </div>
        <p>
          PearOS is the public home of {config.projectName} ({config.symbol}):
          an independent community software project. Explore the comparison,
          find a well-defined task, and follow recorded payments. You don’t need
          to buy or hold a token to contribute.
        </p>
        <Link href="/treasury#budget-policy" className="text-link">
          See the budget proposal <ArrowUpRight size={18} />
        </Link>
      </section>
      <section className="build-preview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / BUILD PEAR</p>
            <h2>Small tasks. Meaningful contributions.</h2>
          </div>
          <Link href="/build" className="text-link">
            See the board <ArrowRight size={18} />
          </Link>
        </div>
        {bounties.length || proposals.length ? (
          <div className="bounty-grid">
            {proposals.slice(0, 3).map((t) => (
              <TaskProposalCard
                key={t.id}
                task={t}
                githubUrl={config.githubUrl}
              />
            ))}
            {bounties.slice(0, Math.max(0, 3 - proposals.length)).map((b) => (
              <BountyCard key={b.id} bounty={b} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="The first tasks are taking shape."
            description="Official bounty terms will appear after maintainer review. Everyone is welcome to contribute."
          />
        )}
      </section>
      <section className="principles">
        <div>
          <ScanLine />
          <h3>Sources in sight</h3>
          <p>
            Each metric keeps its source and observation time. Missing data
            stays missing.
          </p>
        </div>
        <div>
          <Sprout />
          <h3>Build in the open</h3>
          <p>
            Reviewed task terms, GitHub submissions, and a simple path to
            contributing.
          </p>
        </div>
        <div>
          <BookOpen />
          <h3>Payments you can inspect</h3>
          <p>
            Manual payments, recorded transparently. Approval and settlement are
            distinct.
          </p>
        </div>
      </section>
    </>
  );
}
export function TerminalView({
  ratio,
  config,
}: {
  ratio: RatioResponse;
  config: PublicConfig;
}) {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">01 / READ-ONLY OBSERVATORY</p>
        <h1>
          A different unit
          <br />
          of perspective.
        </h1>
        <p>Two separate assets. One comparison. Every source in sight.</p>
      </div>
      <div className="terminal-grid">
        <RatioPanel ratio={ratio} symbol={config.symbol} />
        <section className="panel asset-panel">
          <div className="section-heading">
            <h2>Asset identities</h2>
            <span className="eyebrow">NETWORK + ADDRESS</span>
          </div>
          <div className="asset-identity">
            <span className="asset-letter pear-letter">P</span>
            <div>
              <h3>{config.symbol}</h3>
              <p>{config.projectName} · project token</p>
              <Address
                value={config.projectAddress}
                explorer={config.explorerUrl}
                label="Project token address"
              />
            </div>
          </div>
          <div className="asset-identity">
            <span className="asset-letter">A</span>
            <div>
              <h3>AAPL Stock Token</h3>
              <p>Robinhood reference · compatibility unverified</p>
              <Address
                value={config.referenceAddress}
                explorer={config.explorerUrl}
                label="Reference token address"
              />
            </div>
          </div>
          <p className="small muted">
            {config.chainId
              ? `Configured chain ${config.chainId} / ${config.networkType || "classification missing"}`
              : "Network not configured"}
            . A share quote or another issuer’s token is never substituted.
          </p>
        </section>
      </div>
      <div className="two-columns price-grid">
        {(["project", "reference"] as const).map((key) => {
          const v = ratio.observations[key];
          return (
            <section className="panel" key={key}>
              <p className="eyebrow">
                {key === "project"
                  ? config.symbol + " TOKEN PRICE"
                  : "AAPL STOCK TOKEN REFERENCE"}
              </p>
              <strong className="metric-value">
                {v.data
                  ? `${amount(v.data.amount, 8)} ${v.data.currency}`
                  : "—"}
              </strong>
              <p className="small muted">
                {v.data?.assetLabel || "No verified quote available"} · per
                whole token
              </p>
              <SourceNote value={v} mode={ratio.mode} />
            </section>
          );
        })}
      </div>
      <div className="two-columns">
        <section className="panel history-empty">
          <span className="eyebrow">HISTORY</span>
          <EmptyState
            title="A curve needs real observations."
            description="Historical data has not been verified. No chart or 24-hour change is fabricated; this release does not store price history."
          />
        </section>
        <section className="panel">
          <span className="eyebrow">MARKET / POOL</span>
          <h2>A market is more than an address.</h2>
          <p className="muted">
            Market creation, liquidity and tradability have not been verified.
            The ratio does not establish that a funded pool exists.
          </p>
          <button className="button secondary" disabled>
            Market not verified
          </button>
          <p className="small muted">
            External trading becomes available only after the intended market
            and asset pair are verified.
          </p>
        </section>
      </div>
    </>
  );
}
