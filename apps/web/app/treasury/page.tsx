import { getTreasury } from "@/lib/treasury";
import { TreasuryView } from "@/components/treasury-view";
export const metadata = { title: "Treasury" };
export default async function Page() {
  return <TreasuryView data={await getTreasury()} />;
}
