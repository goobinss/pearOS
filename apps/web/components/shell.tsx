"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WalletControl } from "./wallet";
import { usePublicConfig } from "./providers";

const links = [
  ["/", "Overview"],
  ["/terminal", "Terminal"],
  ["/treasury", "Treasury"],
  ["/build", "Build Pear"],
  ["/studio", "Pear Studio"],
];
export function Header() {
  const pathname = usePathname();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="PearOS home">
            <span className="brand-icon">
              <Image src="/pear-mascot.png" width={34} height={34} alt="" />
            </span>
            <span>
              Pear<span className="brand-os">OS</span>
            </span>
            <span className="version-label">V1</span>
          </Link>
          <nav aria-label="Main navigation">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <WalletControl />
        </div>
      </header>
    </>
  );
}
export function ModeBanner() {
  const config = usePublicConfig();
  return config.demo ? (
    <div className="mode-banner">
      <strong>DEMO WORKSPACE</strong>
      <span>Simulated market data. No A2P token has been connected.</span>
    </div>
  ) : !config.a2pAddress ? (
    <div className="mode-banner prelaunch">
      <strong>PRELAUNCH</strong>
      <span>
        A2P is not configured yet. Available source data will appear
        independently.
      </span>
    </div>
  ) : null;
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <span className="brand-text">Apples to Pears</span>
        <div>
          <a href="https://docs.pair.trade" target="_blank" rel="noreferrer">
            Pair docs
          </a>
          <a
            href="https://docs.ponsfamily.com/v2"
            target="_blank"
            rel="noreferrer"
          >
            Pons docs
          </a>
          <Link href="/api/pear-ratio">Ratio API</Link>
        </div>
      </div>
      <p>
        Independent community project. Not affiliated with or endorsed by Apple,
        Robinhood, Pair.trade, or Pons. A2P does not represent Apple equity. A2P
        and the AAPL Stock Token are separate assets. Pairing does not guarantee
        correlated prices, backing, redemption, or value. No guaranteed yield or
        returns.
      </p>
      <p className="small">
        “1 Apple” means one whole AAPL Stock Token for the Pear Ratio. Stock
        Token availability is subject to issuer restrictions. Prices are
        reference observations, not executable quotes.
      </p>
    </footer>
  );
}
