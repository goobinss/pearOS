import { getRatio } from "@/lib/market";
import { getBounties } from "@/lib/bounties";
import { getDashboard } from "@/lib/backend";
import { HomeView } from "@/components/dashboard-view";
import proposals from "@/content/task-proposals.json";
import { validateTaskProposals } from "@/lib/task-proposals";
export default async function Page() {
  const [ratio, bounties] = await Promise.all([getRatio(), getBounties()]);
  return (
    <HomeView
      ratio={ratio}
      bounties={bounties}
      proposals={validateTaskProposals(proposals)}
      config={(await getDashboard()).config}
    />
  );
}
