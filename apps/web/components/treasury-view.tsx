"use client";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Wallet } from "lucide-react";
import type { Treasury } from "@/lib/dashboard";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@pearos/ui/table";
import { Button } from "@pearos/ui/button";
import { readApi, usePublicConfig } from "./providers";
import {
  AddressLink,
  EmptyState,
  SourceNote,
  TransferTable,
  Status,
} from "./data-display";
import { amount, usd } from "./format";
import { useNow } from "./use-now";

export function TreasuryView({ initial }: { initial: Treasury }) {
  const config = usePublicConfig();
  const now = useNow();
  const query = useQuery({
    queryKey: ["treasury"],
    queryFn: () => readApi<Treasury>("/api/treasury"),
    initialData: initial,
    refetchInterval: 60_000,
  });
  const data = query.data;
  const stale =
    query.isError || now === null ||
    (data.balances.freshUntil &&
      Date.parse(data.balances.freshUntil) < now);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">APPLES TO PEARS / TREASURY</p>
          <h1>Every pear accounted for.</h1>
          <p className="muted">
            A public, read-only view of one project wallet.
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Refresh treasury"
          disabled={query.isFetching}
          onClick={() => query.refetch()}
        >
          <RefreshCw size={16} />
        </Button>
      </div>
      {query.isError && (
        <p role="alert" className="notice">
          Refresh failed. Last observations are shown below.
        </p>
      )}
      <section className="treasury-hero">
        <div>
          <span className="eyebrow">
            {data.totalValueUsd === null || stale
              ? "KNOWN PRICED HOLDINGS"
              : "ESTIMATED TREASURY VALUE"}
          </span>
          <strong>
            {!data.balances.data
              ? "—"
              : usd(data.totalValueUsd ?? data.knownValueUsd)}
          </strong>
          <p>
            {stale
              ? "Stale observation · not a current total"
              : data.unpriced
                ? `${data.unpriced} asset balance(s) unpriced or unavailable. Total value is incomplete.`
                : "USD reference valuation · prices can differ from trade execution"}
          </p>
        </div>
        <div className="treasury-wallet">
          <Wallet size={28} />
          <span>Treasury wallet</span>
          <AddressLink address={data.address} explorer={config.explorerUrl} />
          <Status status={stale ? "stale" : data.balances.status} />
        </div>
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>Holdings</h2>
          <span className="small muted">
            Raw ERC-20 units, normalized by decimals
          </span>
        </div>
        {data.balances.data ? (
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Estimated value</TableHead>
                <TableHead>Contract</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.balances.data.map((balance) => (
                <TableRow key={balance.symbol}>
                  <TableCell>
                    <span
                      className={`asset-token token-${balance.symbol.toLowerCase()}`}
                    >
                      {balance.symbol.slice(0, 1)}
                    </span>
                    <strong>
                      {balance.symbol === "AAPL"
                        ? "AAPL Stock Token"
                        : balance.symbol}
                    </strong>
                    {balance.message && (
                      <span className="table-subtitle">{balance.message}</span>
                    )}
                  </TableCell>
                  <TableCell className="mono">
                    {amount(balance.amount, 6)}
                  </TableCell>
                  <TableCell className="mono">
                    {balance.valueUsd === null
                      ? balance.amount === "0"
                        ? "$0.00"
                        : "Unpriced"
                      : usd(balance.valueUsd)}
                  </TableCell>
                  <TableCell>
                    {balance.symbol === "ETH" ? (
                      "Native asset"
                    ) : (
                      <AddressLink
                        address={balance.address}
                        explorer={config.explorerUrl}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            title="The treasury is not connected yet."
            description={
              data.balances.message ||
              "A configurable wallet or multisig is all V1 needs. Holdings will appear when its address is supplied."
            }
          />
        )}
        <SourceNote
          value={stale ? { ...data.balances, status: "stale" } : data.balances}
        />
      </section>
      <section className="panel">
        <div className="section-heading">
          <h2>Incoming & outgoing</h2>
          <span className="small muted">Recent ERC-20 events</span>
        </div>
        <TransferTable
          observation={data.transactions}
          explorer={config.explorerUrl}
        />
      </section>
      <div className="two-columns">
        <section className="panel">
          <h2>Revenue has a source.</h2>
          <p className="muted">
            A transfer alone does not establish project revenue. V1 keeps
            transfers unclassified until their origin can be reconciled with a
            verified vault event.
          </p>
          <p className="small muted">
            Read vault receipts, released escrow funds, creator credit, and
            liquidity reserves in the terminal. Those balances are separate from
            this treasury wallet.
          </p>
          <a href="/terminal" className="text-link">
            View vault accounting
          </a>
        </section>
        <section className="panel">
          <h2>What this view covers</h2>
          <p className="muted">
            ETH, A2P, AAPL, and an explicitly configured USDC contract. No USDC
            address or one-dollar price is assumed.
          </p>
          <p className="small muted">
            Transfer coverage is bounded and excludes native ETH and internal
            transfers. Full native history and automated revenue classification
            require an indexer.
          </p>
        </section>
      </div>
      {!!data.prices.length && (
        <section className="panel">
          <h2>Valuation sources</h2>
          {data.prices.map((price, index) => (
            <SourceNote key={index} value={price} />
          ))}
        </section>
      )}
    </>
  );
}
