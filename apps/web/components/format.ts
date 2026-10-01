export function amount(
  value: string | number | null | undefined,
  maximumFractionDigits = 4,
): string {
  if (value === null || value === undefined) return "—";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  if (numeric !== 0 && Math.abs(numeric) < 10 ** -maximumFractionDigits)
    return numeric.toPrecision(3);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(
    numeric,
  );
}
export function usd(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return (
    "$" +
    (Math.abs(numeric) < 1 && numeric !== 0
      ? amount(value, 8)
      : new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numeric))
  );
}
export const shortAddress = (address: string) =>
  address.startsWith("0x")
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : address;
export function dateTime(value: string | null | undefined) {
  return value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        hour12: false,
      }) + " UTC"
    : "No observation yet";
}
