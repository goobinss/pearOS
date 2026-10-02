import type { BudgetBucket } from "./types";

export const budgetBuckets: {
  id: BudgetBucket;
  label: string;
  purpose: string;
}[] = [
  {
    id: "contributors",
    label: "Contributor rewards",
    purpose: "Fixed bounties agreed before work starts.",
  },
  {
    id: "support",
    label: "Holder and contributor support",
    purpose: "Capped participation rounds, pending owner and legal review.",
  },
  {
    id: "operations",
    label: "Operations",
    purpose: "Documented hosting, security, tooling and professional costs.",
  },
  {
    id: "ecosystem",
    label: "Product and ecosystem",
    purpose: "Reviewed audits, integrations and educational work.",
  },
  {
    id: "reserve",
    label: "Reserve",
    purpose: "Uncommitted contingency, kept separate from rewards.",
  },
];
