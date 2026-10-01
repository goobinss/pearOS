export interface Bounty {
  id: string;
  title: string;
  description: string;
  category: "Engineering" | "Design" | "Community";
  status: "Open" | "In progress" | "Completed";
  reward: string;
  url?: string;
}
/** Public-only proposed tasks. Rewards require a separate written agreement. */
export const bounties: Bounty[] = [
  {
    id: "mobile",
    title: "Improve mobile layout and keyboard access",
    description: "Refine the five public web pages at narrow widths, keyboard focus, and screen-reader labels.",
    category: "Design", status: "Open", reward: "To be agreed · not funded",
  },
  {
    id: "sdk-example",
    title: "Add a public SDK example",
    description: "Create a small example using getStats and getActivity with a mock API response.",
    category: "Engineering", status: "Open", reward: "To be agreed · not funded",
  },
  {
    id: "chart-a11y",
    title: "Make the ratio chart easier to read",
    description: "Improve the public ratio chart’s labels, text alternative, and keyboard experience.",
    category: "Design", status: "Open", reward: "To be agreed · not funded",
  },
  {
    id: "api-docs",
    title: "Expand public API examples",
    description: "Document public response states and add copyable examples for the read-only endpoints.",
    category: "Community", status: "Open", reward: "To be agreed · not funded",
  },
];
