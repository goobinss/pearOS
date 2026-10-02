import { getRatio } from "@/lib/market";
import { getDashboard } from "@/lib/backend";
import { TerminalView } from "@/components/dashboard-view";
export const metadata = { title: "Terminal" };
export default async function Page() {
  return (
    <TerminalView
      ratio={await getRatio()}
      config={(await getDashboard()).config}
    />
  );
}
