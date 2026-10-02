import type { TaskProposal } from "./types";

export function validateTaskProposals(value: unknown): TaskProposal[] {
  if (!Array.isArray(value) || value.length > 20)
    throw new Error("Invalid task proposal registry");
  const ids = new Set<string>();
  for (const t of value) {
    if (!t || typeof t !== "object" || Array.isArray(t))
      throw new Error("Invalid task proposal");
    if (
      typeof t.id !== "string" ||
      !/^[a-z0-9-]{1,60}$/.test(t.id) ||
      ids.has(t.id)
    )
      throw new Error("Duplicate or invalid task proposal ID");
    ids.add(t.id);
    for (const key of ["title", "summary", "approvalNote"])
      if (
        typeof t[key] !== "string" ||
        !t[key].trim() ||
        t[key].length > (key === "title" ? 160 : 2000)
      )
        throw new Error("Invalid task proposal copy");
    if (
      !["Engineering", "Design", "Community"].includes(t.category) ||
      t.state !== "Planning"
    )
      throw new Error("A proposal cannot authorize assignment or a reward");
    if ("reward" in t || "payment" in t || "assignedTo" in t)
      throw new Error("Publish approved reward terms in the bounty registry");
    for (const key of ["steps", "acceptanceCriteria", "deliverables"])
      if (
        !Array.isArray(t[key]) ||
        !t[key].length ||
        t[key].length > 10 ||
        t[key].some(
          (s: unknown) => typeof s !== "string" || !s.trim() || s.length > 2000,
        )
      )
        throw new Error(
          "Task proposals require clear instructions and deliverables",
        );
  }
  return value as TaskProposal[];
}

export function proposalConversationUrl(
  task: TaskProposal,
  githubUrl: string | null,
) {
  if (!githubUrl) return null;
  const u = new URL(githubUrl);
  if (
    u.origin !== "https://github.com" ||
    u.username ||
    u.password ||
    !/^\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+\/?$/.test(u.pathname) ||
    u.search ||
    u.hash
  )
    throw new Error("Invalid task repository");
  const body = [
    `Task: ${task.title} (${task.id})`,
    "\nHello! I would like to help with this task.",
    "\nMy introduction / relevant experience:\n[Add a sentence or two]",
    "\nMy proposed approach and availability:\n[Describe your plan]",
    "\nProposal or document link (optional):\n[Paste a link or attach a file]",
    "\nPlease confirm scope, assignment and exact reward terms before I begin paid work.",
    "No account creation, public posting or invitation publishing is authorized by this proposal.",
    "I will not include passwords, recovery codes or private account information here.",
  ].join("\n");
  const params = new URLSearchParams({
    title: `[Task proposal] ${task.title}`,
    body,
  });
  return `${githubUrl.replace(/\/$/, "")}/issues/new?${params}`;
}
