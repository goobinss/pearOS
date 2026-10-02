import "server-only";
import { createHash } from "node:crypto";
import project from "../content/project.json";
import bounties from "../content/bounties.json";
import payouts from "../content/payouts.json";
import policies from "../content/budget-policies.json";
import receipts from "../content/receipts.json";
import disbursements from "../content/disbursements.json";
import rounds from "../content/support-rounds.json";
import proposals from "../content/task-proposals.json";
export const officialContent = {
  project,
  bounties,
  payouts,
  "budget-policies": policies,
  receipts,
  disbursements,
  "support-rounds": rounds,
  "task-proposals": proposals,
};
export const contentDigest = createHash("sha256")
  .update(JSON.stringify(officialContent))
  .digest("hex");
