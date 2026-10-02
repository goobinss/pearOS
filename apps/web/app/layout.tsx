import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { Header, Footer, ModeBanner } from "@/components/shell";
import { getDashboard } from "@/lib/backend";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "PearOS · PEAR (A2P)", template: "%s · PearOS" },
  description:
    "Finally, comparing apples to pears. Clear public data, useful community contributions and recorded manual payments.",
  icons: { icon: "/favicon.svg" },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { config, reason } = await getDashboard();
  return (
    <html lang="en">
      <body>
        <Header config={config} />
        <div className="page-container">
          <ModeBanner config={config} />
          {reason ? (
            <p className="backend-notice" role="status">
              {reason}
            </p>
          ) : null}
          <main id="main">{children}</main>
          <Footer symbol={config.symbol} />
        </div>
      </body>
    </html>
  );
}
