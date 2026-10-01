import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header, Footer, ModeBanner } from "@/components/shell";
import { publicConfig, readConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "PearOS · Apples to Pears", template: "%s · PearOS" },
  description:
    "Finally, comparing apples to pears. An independent A2P / AAPL market observatory, transparent treasury, and community toolkit.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers config={publicConfig(readConfig())}>
          <Header />
          <div className="page-container">
            <ModeBanner />
            <main id="main">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
