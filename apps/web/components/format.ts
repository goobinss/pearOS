// String formatting preserves large quantities; display truncation never changes stored terms.
export function amount(value: string | null | undefined, places = 6): string {
  if (value === null || value === undefined || !/^\d+(\.\d+)?$/.test(value))
    return "—";
  const [whole, fraction = ""] = value.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const trimmed = fraction.slice(0, places).replace(/0+$/, "");
  if (whole === "0" && !trimmed && /[1-9]/.test(fraction))
    return `<0.${"0".repeat(Math.max(0, places - 1))}1`;
  return grouped + (trimmed ? `.${trimmed}` : "");
}
export const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
export function dateTime(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        hour12: false,
      }).format(new Date(value)) + " UTC"
    : "No observation yet";
}
