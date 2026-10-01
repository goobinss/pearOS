import { isAddress } from "viem";
import type { Observation, Freshness, Transfer } from "@/lib/types";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@pearos/ui/empty";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@pearos/ui/table";
import { dateTime, shortAddress, amount } from "./format";

export function Status({ status }: { status: Freshness }) {
  return (
    <span className={`status status-${status}`}>
      {status === "live"
        ? "Observed"
        : status === "cached"
          ? "Cached"
          : status === "stale"
            ? "Stale"
            : status === "demo"
              ? "Demo"
              : "Unavailable"}
    </span>
  );
}
export function SourceNote({ value }: { value: Observation<unknown> }) {
  return (
    <div className="source-note">
      <Status status={value.status} />
      <span>
        {value.source} · {dateTime(value.observedAt)}
      </span>
      {value.message && <p>{value.message}</p>}
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
    <Empty className="empty-state">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
export function Metric({
  label,
  value,
  detail,
  status,
}: {
  label: string;
  value: string;
  detail?: string;
  status?: Freshness;
}) {
  return (
    <div className="metric">
      <div className="metric-label">
        <span>{label}</span>
        {status && <Status status={status} />}
      </div>
      <strong className="metric-value">{value}</strong>
      {detail && <p className="small muted">{detail}</p>}
    </div>
  );
}
export function AddressLink({
  address,
  explorer,
}: {
  address: string | null | undefined;
  explorer: string;
}) {
  return address && isAddress(address, { strict: false }) ? (
    <a
      className="mono address-link"
      href={`${explorer}/address/${address}`}
      title={address}
      target="_blank"
      rel="noreferrer"
    >
      {shortAddress(address)}
    </a>
  ) : (
    <span className="muted">
      {address === "demo" ? "Simulated" : "Not configured"}
    </span>
  );
}
export function TransferTable({
  observation,
  explorer,
}: {
  observation: Observation<Transfer[]>;
  explorer: string;
}) {
  return (
    <>
      {observation.data?.length ? (
        <Table className="data-table">
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observation.data.map((tx, index) => (
              <TableRow key={`${tx.hash}-${index}`}>
                <TableCell>
                  <span className={`direction direction-${tx.direction}`}>
                    {tx.direction === "in"
                      ? "Received"
                      : tx.direction === "out"
                        ? "Sent"
                        : tx.direction === "self"
                          ? "Self-transfer"
                          : "Transfer"}
                  </span>
                  <span className="table-subtitle">{tx.category}</span>
                </TableCell>
                <TableCell className="mono">
                  {amount(tx.amount)} {tx.symbol}
                </TableCell>
                <TableCell>{dateTime(tx.timestamp)}</TableCell>
                <TableCell>
                  {/^0x[0-9a-f]{64}$/i.test(tx.hash) ? (
                    <a
                      className="mono"
                      href={`${explorer}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {shortAddress(tx.hash)}
                    </a>
                  ) : (
                    "Example"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          title={
            observation.status === "unavailable"
              ? "Activity is unavailable"
              : "No transfers in this window"
          }
          description={
            observation.message ||
            "Recent, confirmed ERC-20 transfers will appear here when an A2P contract is connected."
          }
        />
      )}
      <SourceNote value={observation} />
    </>
  );
}
