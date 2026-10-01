"use client";

import { useState } from "react";
import { useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Wallet, Copy, Check } from "lucide-react";
import { Button } from "@pearos/ui/button";
import { useHolder, usePublicConfig } from "./providers";
import { amount, shortAddress } from "./format";
import { SourceNote } from "./data-display";
import { useNow } from "./use-now";

export function WalletControl() {
  const config = usePublicConfig();
  const now = useNow();
  const holder = useHolder();
  const { connectors, connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    switchChain,
    isPending: switching,
    error: switchError,
  } = useSwitchChain();
  const [open, setOpen] = useState(false),
    [copied, setCopied] = useState(false);
  return (
    <div className="wallet-control">
      <Button
        variant="outline"
        className="wallet-button"
        aria-expanded={open}
        aria-controls="wallet-panel"
        onClick={() => setOpen(!open)}
      >
        <Wallet size={16} />
        {holder.address ? shortAddress(holder.address) : "Connect wallet"}
      </Button>
      {open && (
        <div
          className="wallet-panel"
          id="wallet-panel"
          role="region"
          aria-label="Wallet"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <div className="section-heading">
            <strong>
              {holder.address ? "Your wallet" : "Connect to PearOS"}
            </strong>
            <button
              className="text-button"
              aria-label="Close wallet panel"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          {!holder.address ? (
            <>
              <p className="muted">
                Choose a browser wallet to read your balances.
              </p>
              <div className="wallet-options">
                {connectors.map((connector) => (
                  <Button
                    key={connector.uid}
                    variant="outline"
                    disabled={isPending}
                    onClick={() => connect({ connector })}
                  >
                    {isPending ? "Connecting…" : connector.name}
                  </Button>
                ))}
              </div>
              <p className="small muted">
                Use a wallet extension or a mobile wallet’s browser. Connecting
                never grants token spending access.
              </p>
            </>
          ) : (
            <>
              <button
                className="address-copy"
                title={holder.address}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(holder.address!);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {shortAddress(holder.address)}
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
              <p className="small">
                Network:{" "}
                {holder.chainId === config.chainId
                  ? "Robinhood Chain"
                  : `chain ${holder.chainId ?? "unknown"}`}
              </p>
              {!holder.correctNetwork ? (
                <div className="notice">
                  <p>Switch to Robinhood Chain to verify your balances.</p>
                  <Button
                    disabled={switching}
                    onClick={() => switchChain({ chainId: config.chainId })}
                  >
                    {switching ? "Switching…" : "Switch network"}
                  </Button>
                </div>
              ) : (
                <>
                  {holder.balances.isLoading && <p>Reading balances…</p>}
                  {holder.balances.data?.data
                    ?.filter((balance) =>
                      ["ETH", "A2P"].includes(balance.symbol),
                    )
                    .map((balance) => (
                      <div className="key-value" key={balance.symbol}>
                        <span>{balance.symbol}</span>
                        <strong>{amount(balance.amount)}</strong>
                      </div>
                    ))}
                  {(holder.balances.isError ||
                    holder.balances.data?.status === "unavailable") && (
                    <p className="small muted">
                      Balances are currently unavailable. Your connection is
                      still active.
                    </p>
                  )}
                  {holder.balances.data && (
                    <SourceNote
                      value={{
                        ...holder.balances.data,
                        status:
                          holder.balances.data.data &&
                          (holder.balances.isError ||
                            !holder.balances.data.observedAt ||
                            now === null ||
                            now - Date.parse(holder.balances.data.observedAt) >
                              120_000)
                            ? "stale"
                            : holder.balances.data.status,
                      }}
                    />
                  )}
                  <div
                    className={`holder-badge ${holder.isHolder ? "is-holder" : ""}`}
                  >
                    {holder.isHolder
                      ? "Pear Club · holder verified"
                      : "Holder perks unlock after a fresh A2P balance check"}
                  </div>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  disconnect();
                  setCopied(false);
                }}
              >
                Disconnect
              </Button>
            </>
          )}
          {(error || switchError) && (
            <p role="alert" className="error-text">
              The wallet request did not complete. Check your wallet and try
              again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
