import { officialContent, contentDigest } from "../lib/content";
import { validateTaskProposals } from "../lib/task-proposals";
if (
  officialContent.project.name !== "PEAR" ||
  officialContent.project.symbol !== "A2P"
)
  throw new Error("Invalid project identity");
for (const [key, value] of Object.entries(officialContent))
  if (key !== "project" && !Array.isArray(value))
    throw new Error("Invalid content file");
validateTaskProposals(officialContent["task-proposals"]);
console.log(
  `Public content digest: ${contentDigest}. Pear Core validates financial terms and funding before serving them.`,
);
