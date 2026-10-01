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
    url: "https://github.com/goobinss/pearOS/issues/5",
  },
  {
    id: "sdk-example",
    title: "Add a runnable public SDK mock example",
    description: "Create a small example using getStats and getActivity with a mock API response.",
    category: "Engineering", status: "Open", reward: "To be agreed · not funded",
    url: "https://github.com/goobinss/pearOS/issues/6",
  },
  {
    id: "chart-a11y",
    title: "Improve ratio chart accessibility",
    description: "Improve the public ratio chart’s labels, text alternative, and keyboard experience.",
    category: "Design", status: "Open", reward: "To be agreed · not funded",
    url: "https://github.com/goobinss/pearOS/issues/7",
  },
  {
    id: "api-docs",
    title: "Expand public API response examples",
    description: "Document public response states and add copyable examples for the read-only endpoints.",
    category: "Community", status: "Open", reward: "To be agreed · not funded",
    url: "https://github.com/goobinss/pearOS/issues/8",
  },
];
