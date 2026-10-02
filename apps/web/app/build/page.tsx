import { getBounties } from "@/lib/bounties";
import { BuildBoard } from "@/components/build-board";
import { ContributorGuide } from "@/components/contributor-guide";
import { getDashboard } from "@/lib/backend";
import { buildFilters } from "@/lib/build-filters";
import { validateTaskProposals } from "@/lib/task-proposals";
import proposals from "@/content/task-proposals.json";
export const metadata = { title: "Build Pear" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { config } = await getDashboard();
  const filters = buildFilters(await searchParams);
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">02 / BUILD PEAR</p>
        <h1>
          Build something
          <br />
          worth contributing to.
        </h1>
        <p>
          Help build the community, design something useful or improve the
          software. Agree on scope and rewards with the owner, share your work
          and get it reviewed. No token holdings required.
        </p>
      </div>
      <ContributorGuide
        githubUrl={config.githubUrl}
        demo={config.mode === "demo"}
      />
      <BuildBoard
        bounties={await getBounties()}
        proposals={validateTaskProposals(proposals)}
        githubUrl={config.githubUrl}
        category={filters.category}
        state={filters.state}
      />
    </>
  );
}
