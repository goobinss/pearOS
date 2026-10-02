"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { shortAddress } from "./format";
export function Address({
  value,
  explorer,
  label = "Address",
}: {
  value: string | null;
  explorer: string | null;
  label?: string;
}) {
  const [feedback, setFeedback] = useState("");
  if (!value) return <span className="muted">Not configured</span>;
  return (
    <div className="address-control">
      <span className="sr-only">{label}: </span>
      {explorer ? (
        <a
          href={`${explorer}/address/${value}`}
          title={value}
          aria-label={`${label}: ${value} (explorer)`}
          target="_blank"
          rel="noreferrer"
          className="mono"
        >
          {shortAddress(value)}
        </a>
      ) : (
        <span title={value} className="mono">
          {shortAddress(value)}
        </span>
      )}
      <button
        className="icon-button"
        aria-label={`Copy ${label.toLowerCase()}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setFeedback("Copied");
          } catch {
            setFeedback("Copy failed; select the full address below");
          }
        }}
      >
        {feedback === "Copied" ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <span role="status" className="copy-feedback">
        {feedback}
      </span>
      <details>
        <summary>Full address</summary>
        <code className="full-address">{value}</code>
      </details>
    </div>
  );
}
