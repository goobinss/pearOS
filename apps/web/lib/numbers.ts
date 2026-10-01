import { formatUnits } from "viem";

const SCALE = 36;
const UNIT = 10n ** BigInt(SCALE);

/** Decimal strings in, decimal strings out; never do financial math with floats. */
export function decimal(value: unknown): string {
  if (typeof value !== "number" && typeof value !== "string")
    throw new Error("Expected a decimal value");
  if (typeof value === "number" && !Number.isFinite(value))
    throw new Error("Non-finite decimal");
  if (
    typeof value === "number" &&
    Number.isInteger(value) &&
    !Number.isSafeInteger(value)
  )
    throw new Error("Unsafe integer; supply an exact decimal string");
  let text = String(value).trim();
  const scientific = /^([+-]?)(\d+)(?:\.(\d*))?[eE]([+-]?\d+)$/.exec(text);
  if (scientific) {
    const [, sign, whole, fraction = "", exponent] = scientific;
    const shift = Number(exponent);
    if (Math.abs(shift) > 300) throw new Error("Decimal exponent out of range");
    const digits = whole + fraction;
    const point = whole.length + shift;
    text =
      sign +
      (point <= 0
        ? "0." + "0".repeat(-point) + digits
        : point >= digits.length
          ? digits + "0".repeat(point - digits.length)
          : digits.slice(0, point) + "." + digits.slice(point));
  }
  if (!/^-?\d+(\.\d+)?$/.test(text) || text.length > 400)
    throw new Error("Invalid decimal");
  const [whole, fraction = ""] = text.split(".");
  if (fraction.length > SCALE && /[1-9]/.test(fraction.slice(SCALE)))
    throw new Error("Decimal precision exceeds 36 places");
  return fraction ? `${whole}.${fraction.slice(0, SCALE)}` : whole;
}

function fixed(value: string): bigint {
  const text = decimal(value);
  const negative = text.startsWith("-");
  const [whole, fraction = ""] = (negative ? text.slice(1) : text).split(".");
  return (
    (BigInt(whole) * UNIT + BigInt(fraction.padEnd(SCALE, "0"))) *
    (negative ? -1n : 1n)
  );
}

function unfix(value: bigint): string {
  return formatUnits(value, SCALE);
}
export const positive = (value: string) => fixed(value) > 0n;
export const nonnegative = (value: string) => fixed(value) >= 0n;
export const multiply = (a: string, b: string) =>
  unfix((fixed(a) * fixed(b)) / UNIT);
export const add = (a: string, b: string) => unfix(fixed(a) + fixed(b));
export const subtract = (a: string, b: string) => unfix(fixed(a) - fixed(b));
export function divide(a: string, b: string): string {
  if (fixed(b) === 0n) throw new Error("Cannot divide by zero");
  return unfix((fixed(a) * UNIT) / fixed(b));
}
export const midpoint = (bid: string, ask: string) =>
  divide(add(bid, ask), "2");
export function percentageChange(
  current: string,
  previous: string,
): string | null {
  return positive(previous)
    ? multiply(divide(subtract(current, previous), previous), "100")
    : null;
}
export function normalizeTokenPrice(
  bid: string,
  ask: string,
  multiplier: string,
): string {
  if (
    !positive(bid) ||
    !positive(ask) ||
    !positive(multiplier) ||
    fixed(ask) < fixed(bid)
  )
    throw new Error("Invalid bid, ask, or multiplier");
  return multiply(midpoint(bid, ask), multiplier);
}
export function tokenAmount(raw: bigint, decimals: number): string {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255 || raw < 0n)
    throw new Error("Invalid token units");
  return formatUnits(raw, decimals);
}
export function treasuryValue(
  items: { amount: string | null; priceUsd: string | null }[],
) {
  let knownValueUsd = "0";
  let unpriced = 0;
  for (const item of items) {
    if (
      item.amount === null ||
      (positive(item.amount) &&
        (item.priceUsd === null || !positive(item.priceUsd)))
    ) {
      unpriced++;
      continue;
    }
    if (!nonnegative(item.amount)) throw new Error("Negative balance");
    if (item.priceUsd !== null) {
      if (!nonnegative(item.priceUsd)) throw new Error("Negative price");
      knownValueUsd = add(knownValueUsd, multiply(item.amount, item.priceUsd));
    }
  }
  return {
    knownValueUsd,
    totalValueUsd: unpriced === 0 ? knownValueUsd : null,
    unpriced,
  };
}
