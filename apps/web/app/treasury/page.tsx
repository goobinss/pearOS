import { getTreasury } from "@/lib/dashboard";
import { TreasuryView } from "@/components/treasury-view";
export const metadata = { title: "Treasury" };
export default async function Page() {
  return <TreasuryView initial={await getTreasury()} />;
}
