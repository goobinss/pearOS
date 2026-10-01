"use client";
import { useEffect, useState } from "react";
/** Client clock. Null during server render and until the first browser tick. */
export function useNow(intervalMs = 30_000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const initial = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, intervalMs);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, [intervalMs]);
  return now;
}
