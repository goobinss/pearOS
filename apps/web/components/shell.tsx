"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { PublicConfig } from "@/lib/config";
const links = [
  ["/terminal", "Terminal"],
  ["/build", "Build Pear"],
  ["/treasury", "Treasury"],
];
export function Header({ config }: { config: PublicConfig }) {
  const path = usePathname(),
    [open, setOpen] = useState(false);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="PearOS home">
            <Image src="/pear-mascot.png" alt="" width={32} height={40} />
            <span>
              Pear<span className="brand-os">OS</span>
            </span>
            <span className="version-label">01</span>
          </Link>
          <button
            className="menu-button"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-nav"
            aria-label="Main navigation"
            className={open ? "is-open" : ""}
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            {config.githubUrl ? (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="github-nav"
              >
                GitHub <ArrowUpRight size={15} />
              </a>
            ) : (
              <span className="muted small">GitHub · not configured</span>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
export function ModeBanner({ config }: { config: PublicConfig }) {
  return (
    <div
      className={`mode-banner ${config.mode === "demo" ? "" : "live-banner"}`}
    >
      <strong>
        {config.mode === "demo" ? "DEMO WORKSPACE" : "LIVE · READ ONLY"}
      </strong>
      <span>
        {config.mode === "demo"
          ? "Synthetic data & example tasks. No real funding or market represented."
          : "Only configured, verified sources. Missing data stays visible."}
      </span>
      <span className="banner-end">
        {config.mode === "demo"
          ? "PREVIEW / 01"
          : config.networkType || "NETWORK UNCONFIGURED"}
      </span>
    </div>
  );
}
export function Footer({ symbol }: { symbol: string }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/" className="brand-text">
          PEAR · {symbol}
          <span className="small"> A little different. Open by design.</span>
        </Link>
        <Link href="/api/pear-ratio">
          Read-only ratio API <ArrowUpRight size={14} />
        </Link>
      </div>
      <p>
        Independent community project. Not affiliated with or endorsed by Apple,
        Robinhood, Pair.trade or Pons. {symbol} is the project ticker, not proof
        of an asset’s identity. The ratio is a price comparison, not backing,
        redemption or an executable quote.
      </p>
      <p>
        Contributions are open to everyone. No purchase or token holdings
        required.
      </p>
    </footer>
  );
}
