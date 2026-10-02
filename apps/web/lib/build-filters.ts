export const categories = [
  "All",
  "Engineering",
  "Design",
  "Community",
] as const;
export const workflows = [
  "All",
  "Planning",
  "Open",
  "Assigned",
  "Submitted",
  "Changes requested",
  "Approved",
  "Cancelled",
  "Paid",
] as const;
export function buildFilters(
  params: Record<string, string | string[] | undefined>,
) {
  return {
    category:
      typeof params.category === "string" &&
      categories.some((c) => c === params.category)
        ? params.category
        : "All",
    state:
      typeof params.status === "string" &&
      workflows.some((s) => s === params.status)
        ? params.status
        : "All",
  };
}
export function buildFilterUrl(category: string, state: string) {
  const query = new URLSearchParams();
  if (category !== "All") query.set("category", category);
  if (state !== "All") query.set("status", state);
  return `/build${query.size ? "?" + query : ""}`;
}
