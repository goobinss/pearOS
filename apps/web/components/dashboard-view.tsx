"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Terminal, Layers, Sprout, Palette } from "lucide-react";
import type { Dashboard } from "@/lib/dashboard";
import type { Observation, Transfer } from "@/lib/types";
import { Button } from "@pearos/ui/button";
import { readApi } from "./providers";
import {
  Metric,
  SourceNote,
  AddressLink,
  TransferTable,
  Status,
} from "./data-display";
import { RatioChart } from "./ratio-chart";
import { amount, usd, dateTime } from "./format";
import { useNow } from "./use-now";

function ageSources<T>(value: T, failed: boolean, now: number | null): T {
  if (Array.isArray(value))
    return value.map((item) => ageSources(item, failed, now)) as T;
  if (!value || typeof value !== "object") return value;
  const row = value as Record<string, unknown>;
  const result = Object.fromEntries(
    Object.entries(row).map(([key, entry]) => [key, ageSources(entry, failed, now)]),
  );
  if (
    "observedAt" in row &&
    row.data &&
    ["live", "cached"].includes(String(row.status)) &&
    (failed || now === null ||
      (typeof row.freshUntil === "string" &&
        Date.parse(row.freshUntil) < now))
  )
    result.status = "stale";
  return result as T;
}

export function DashboardView({
  initial,
  terminal = false,
}: {
  initial: Dashboard;
  terminal?: boolean;
}) {
  const now = useNow();
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => readApi<Dashboard>("/api/dashboard"),
    initialData: initial,
    refetchInterval: 60_000,
  });
  const data = ageSources(query.data, query.isError, now);
  const activity = useQuery({
    queryKey: ["transactions"],
    queryFn: () => readApi<Observation<Transfer[]>>("/api/transactions"),
    enabled: terminal,
    refetchInterval: 60_000,
  });
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            APPLES TO PEARS / {terminal ? "MARKETS" : "WORKSPACE"}
          </p>
          <h1>
            {terminal
              ? "The market, in perspective."
              : "Finally, comparing apples to pears."}
          </h1>
        </div>
        <div className="page-tools">
          <span className="network-label">
            <span className="network-icon">R</span>Robinhood Chain
          </span>
          <Button
            variant="outline"
            size="icon"
            title="Refresh market data"
            aria-label="Refresh market data"
            disabled={query.isFetching}
            onClick={() => query.refetch()}
          >
            <RefreshCw
              size={16}
              className={query.isFetching ? "refreshing" : ""}
            />
          </Button>
        </div>
      </div>
      {query.isError && (
        <div role="alert" className="notice">
          Refresh failed. The last successful observations remain visible with
          their original timestamps.
        </div>
      )}
      {terminal ? (
        <TerminalDetails data={data} />
      ) : (
        <>
          <section className="hero-grid">
            <div className="ratio-hero">
              <div className="section-heading">
                <span className="eyebrow">THE PEAR RATIO</span>
                <Status status={data.ratio.status} />
              </div>
              <div className="ratio-equation">
                <span className="one-apple">1 Apple =</span>
                <strong>
                  {data.ratio.data
                    ? amount(data.ratio.data.pearsPerApple, 2)
                    : "—"}
                </strong>
                <span className="pears-label">
                  Pears
                  <span className="metric-unit"> A2P / AAPL Stock Token</span>
                </span>
              </div>
              <div className="ratio-bottom">
                <p>
                  {data.ratio.data
                    ? "One token-equivalent, a different perspective."
                    : "Waiting for both timestamped token prices."}
                </p>
                <Link href="/terminal" className="text-link">
                  Explore the terminal <Terminal size={15} />
                </Link>
              </div>
              <div className="hero-footnote">
                <span>{dateTime(data.ratio.observedAt)}</span>
                <span>
                  {data.change24h !== null
                    ? `${Number(data.change24h) >= 0 ? "+" : ""}${amount(data.change24h, 2)}% ratio / 24h`
                    : "24h comparison not available"}
                </span>
              </div>
            </div>
            <div className="mascot-panel">
              <div className="mascot-caption">
                <span className="eyebrow">A LITTLE DIFFERENT.</span>
                <h2>
                  A pear with
                  <br />a point of view.
                </h2>
              </div>
              <Image
                src="/pear-mascot.png"
                alt="PearOS mascot: a smiling green pear"
                width="330"
                height="330"
                className="hero-mascot"
              />
              <span className="mascot-code">PEAR / 001</span>
            </div>
          </section>
          <div className="metrics-grid">
            <Metric
              label="A2P"
              value={usd(data.a2p.data?.usd)}
              detail="Apples to Pears · community token"
              status={data.a2p.status}
            />
            <Metric
              label="AAPL Stock Token"
              value={usd(data.stock.price.data?.usd)}
              detail="Token-equivalent USD reference"
              status={data.stock.price.status}
            />
            <Metric
              label="Paired market"
              value={data.vault.data?.fundingState || "Not verified"}
              detail="A separate A2P / AAPL liquidity pool"
              status={data.vault.status}
            />
          </div>
          <div className="overview-lower">
            <RatioChart history={data.history} />
            <section className="panel market-overview">
              <div className="section-heading">
                <h2>
                  Two assets.
                  <br />
                  Separate identities.
                </h2>
                <Layers size={20} />
              </div>
              <div className="asset-row">
                <span className="asset-icon pear-asset">P</span>
                <div>
                  <strong>A2P</strong>
                  <p>Apples to Pears</p>
                </div>
                <AddressLink
                  address={data.a2pAddress}
                  explorer={data.explorerUrl}
                />
              </div>
              <div className="asset-row">
                <span className="asset-icon apple-asset">A</span>
                <div>
                  <strong>AAPL</strong>
                  <p>Robinhood Stock Token</p>
                </div>
                <AddressLink
                  address={data.aaplAddress}
                  explorer={data.explorerUrl}
                />
              </div>
              <p className="small muted">
                The ratio compares reference prices. It does not imply Apple
                ownership, backing, or a redemption rate.
              </p>
              <div className="overview-links">
                <Link href="/build">
                  <Sprout size={18} />
                  <span>Build something useful</span>
                </Link>
                <Link href="/studio">
                  <Palette size={18} />
                  <span>Make a Pear announcement</span>
                </Link>
              </div>
            </section>
          </div>
          <div className="observation-strip">
            <SourceNote value={data.stock.price} />
            <SourceNote value={data.a2p} />
          </div>
        </>
      )}
      {terminal && (
        <section className="panel">
          <div className="section-heading">
            <h2>Pear Treasury</h2>
            <Link href="/treasury" className="text-link">
              View treasury
            </Link>
          </div>
          {data.treasuryBalances.data ? (
            <div className="metrics-grid four inset">
              {data.treasuryBalances.data.map((balance) => (
                <Metric
                  key={balance.symbol}
                  label={`${balance.symbol} balance`}
                  value={amount(balance.amount)}
                  status={data.treasuryBalances.status}
                />
              ))}
            </div>
          ) : (
            <p className="muted">
              Configure a treasury wallet to display its balances.
            </p>
          )}
          <SourceNote value={data.treasuryBalances} />
        </section>
      )}
      {terminal && (
        <section className="panel">
          <div className="section-heading">
            <h2>Recent A2P transfers</h2>
            <span className="small muted">Bounded onchain window</span>
          </div>
          {activity.data ? (
            <TransferTable
              observation={ageSources(activity.data, activity.isError, now)}
              explorer={data.explorerUrl}
            />
          ) : (
            <p className="muted">
              {activity.isError
                ? "Transfer data is unavailable."
                : "Reading recent token events…"}
            </p>
          )}
        </section>
      )}
    </>
  );
}

function TerminalDetails({ data }: { data: Dashboard }) {
  const pons = data.pons.data,
    vault = data.vault.data,
    project = data.project.data;
  const feeRouting =
    pons && vault
      ? pons.feeRecipient.toLowerCase() === vault.address.toLowerCase()
      : null;
  return (
    <>
      <div className="terminal-summary">
        <div>
          <span className="eyebrow">1 AAPL STOCK TOKEN</span>
          <strong>
            {amount(data.ratio.data?.pearsPerApple, 2)} <span>A2P</span>
          </strong>
        </div>
        <SourceNote value={data.ratio} />
      </div>
      <div className="metrics-grid four">
        <Metric
          label="A2P price"
          value={usd(data.a2p.data?.usd)}
          status={data.a2p.status}
        />
        <Metric
          label="Indexed liquidity"
          value={usd(project?.liquidityUsd)}
          status={data.project.status}
          detail="USD · Pair index scope"
        />
        <Metric
          label="24h volume"
          value={usd(project?.volume24hUsd)}
          status={data.project.status}
          detail="USD · Pair index scope"
        />
        <Metric
          label="Holder count"
          value={amount(data.holderCount.data, 0)}
          status={data.holderCount.status}
          detail="Full holder index required in live mode"
        />
      </div>
      <div className="two-columns">
        <section className="panel">
          <div className="section-heading">
            <h2>Official Pons market</h2>
            <Status status={data.pons.status} />
          </div>
          <dl className="detail-list">
            <Row
              label="Market status"
              value={pons?.phaseLabel || "Unavailable"}
            />
            <Row
              label="Quote asset"
              value={pons?.quoteSymbol || "Unavailable"}
            />
            <Row
              label="Bonding curve"
              value={
                <AddressLink
                  address={pons?.curve}
                  explorer={data.explorerUrl}
                />
              }
            />
            <Row
              label="Raised (current curve / sweep)"
              value={
                pons?.raised !== null && pons?.raised !== undefined
                  ? `${amount(pons.raised)} ${pons.quoteSymbol}`
                  : "Not available for this phase"
              }
            />
            <Row
              label="Graduation progress"
              value={
                pons?.progressPercent !== null &&
                pons?.progressPercent !== undefined
                  ? `${amount(pons.progressPercent, 1)}%`
                  : "Unavailable"
              }
            />
            <Row
              label="Creator tax"
              value={
                pons ? `${amount(pons.creatorTaxBps / 100, 2)}%` : "Unavailable"
              }
            />
            <Row
              label="Pons fee recipient"
              value={
                <AddressLink
                  address={pons?.feeRecipient}
                  explorer={data.explorerUrl}
                />
              }
            />
            <Row
              label="Fees currently route to Pair vault"
              value={
                feeRouting === null
                  ? "Unknown"
                  : feeRouting
                    ? "Yes"
                    : "No · recipient changed"
              }
            />
          </dl>
          <SourceNote value={data.pons} />
        </section>
        <section className="panel">
          <div className="section-heading">
            <h2>A2P / AAPL paired pool</h2>
            <Status status={data.vault.status} />
          </div>
          <dl className="detail-list">
            <Row
              label="Funding state"
              value={vault?.fundingState || "Unavailable"}
            />
            <Row
              label="Pool"
              value={
                <AddressLink
                  address={vault?.pool}
                  explorer={data.explorerUrl}
                />
              }
            />
            <Row
              label="Reserve spot ratio"
              value={
                vault?.poolPearsPerApple
                  ? `${amount(vault.poolPearsPerApple, 2)} A2P / AAPL`
                  : "Unavailable"
              }
            />
            <Row
              label="Vault"
              value={
                <AddressLink
                  address={vault?.address}
                  explorer={data.explorerUrl}
                />
              }
            />
            <Row
              label="Creator"
              value={
                <AddressLink
                  address={vault?.creator || project?.creator}
                  explorer={data.explorerUrl}
                />
              }
            />
            <Row
              label="Vault execution"
              value={
                vault ? (vault.paused ? "Paused" : "Not paused") : "Unknown"
              }
            />
            <Row
              label="A2P inventory in vault"
              value={
                vault ? `${amount(vault.a2pInventory)} A2P` : "Unavailable"
              }
            />
            <Row
              label="AAPL inventory in vault"
              value={
                vault ? `${amount(vault.quoteInventory)} AAPL` : "Unavailable"
              }
            />
          </dl>
          <p className="small muted">
            Pool reserves describe a spot rate before fees and slippage. An
            asset appearing in search does not verify its launch or conversion
            route.
          </p>
          <SourceNote value={data.vault} />
        </section>
      </div>
      <section className="panel">
        <div className="section-heading">
          <h2>Follow the proceeds</h2>
          <span className="small muted">
            Separate balances, separate stages
          </span>
        </div>
        <div className="metrics-grid four inset">
          <Metric
            label="Released escrow · unclaimed"
            value={vault ? `${amount(vault.releasedEscrowEth)} ETH` : "—"}
            detail="Released by Pons; still outside the vault"
          />
          <Metric
            label="Reserved for liquidity"
            value={vault ? `${amount(vault.reservedLiquidityEth)} ETH` : "—"}
            detail="Vault reserve; not deposited liquidity"
          />
          <Metric
            label="Creator credit"
            value={vault ? `${amount(vault.creatorClaimableEth)} ETH` : "—"}
            detail="Current claimable creator allocation"
          />
          <Metric
            label="Native spend to date"
            value={vault ? `${amount(vault.totalInvestedEth)} ETH` : "—"}
            detail="Cumulative execution spend, net refunds"
          />
        </div>
        <p className="small muted">
          Revenue-path receipts:{" "}
          {vault ? `${amount(vault.totalReceivedEth)} ETH` : "unavailable"}.
          These may include plain ETH donations. Reserved for the separate PAIR
          buyback engine:{" "}
          {vault
            ? `${amount(vault.reservedPairBuybackEth)} ETH`
            : "unavailable"}
          . Neither figure proves a completed buyback or future revenue.
        </p>
        <SourceNote value={data.vault} />
      </section>
      <div className="two-columns">
        <section className="panel">
          <h2>AAPL reference</h2>
          <dl className="detail-list">
            <Row
              label="Token-equivalent USD"
              value={usd(data.stock.price.data?.usd)}
            />
            <Row
              label="Corporate-action multiplier"
              value={data.stock.metadata.data?.multiplier || "Unavailable"}
            />
            <Row
              label="Asset status"
              value={data.stock.metadata.data?.status || "Unavailable"}
            />
            <Row
              label="Trading halt"
              value={
                data.stock.halted === null
                  ? "Unknown"
                  : data.stock.halted
                    ? "Halted"
                    : "No halt reported"
              }
            />
            <Row
              label="Pending multiplier"
              value={
                data.stock.metadata.data?.pendingMultiplier ||
                (data.stock.metadata.data ? "None reported" : "Unknown")
              }
            />
          </dl>
          <p className="small muted">
            A halt flag or an active asset status does not guarantee that an
            A2P/AAPL DEX route is executable.
          </p>
          <SourceNote value={data.stock.price} />
          <SourceNote value={data.stock.metadata} />
        </section>
        <section className="panel">
          <h2>Launch readiness</h2>
          <dl className="detail-list">
            <Row
              label="AAPL in Pair search"
              value={
                data.readiness.asset.data
                  ? data.readiness.asset.data.discovered
                    ? "Matching address found"
                    : "Not found"
                  : "Unavailable"
              }
            />
            <Row
              label="Pair launch configuration"
              value={
                data.readiness.economics.data
                  ? data.readiness.economics.data.launchConfigured &&
                    data.readiness.economics.data.enabled
                    ? "Enabled in source snapshot"
                    : "Disabled in source snapshot"
                  : "Unavailable"
              }
            />
            <Row
              label="A2P / AAPL launch route"
              value="Not verified by this app"
            />
            <Row
              label="A2P valuation"
              value={`${usd(project?.valuationUsd)}${project?.valuationBasis ? ` · ${project.valuationBasis}` : ""}`}
            />
          </dl>
          <p className="small muted">
            The official Pair launch flow authenticates your wallet and
            simulates the actual launch. Use that result to verify eligibility
            and route support.
          </p>
          <a
            className="text-link"
            href="https://pair.trade/launch"
            target="_blank"
            rel="noreferrer"
          >
            Open Pair’s launch flow
          </a>
          <SourceNote value={data.readiness.economics} />
          <SourceNote value={data.readiness.asset} />
        </section>
      </div>
      <RatioChart history={data.history} />
    </>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
