"use client";
import { useState } from "react";
import type { Observation, RatioPoint } from "@/lib/types";
import { Button } from "@pearos/ui/button";
import { EmptyState, SourceNote } from "./data-display";
import { amount } from "./format";
import { useNow } from "./use-now";

export function RatioChart({
  history,
}: {
  history: Observation<RatioPoint[]>;
}) {
  const [range, setRange] = useState(1),
    [selected, setSelected] = useState<RatioPoint | null>(null);
  const now = useNow();
  const points = (history.data || []).filter(
    (p) => now !== null && now - Date.parse(p.timestamp) <= range * 86_400_000 + 1000,
  );
  const values = points.map((p) => Number(p.pearsPerApple));
  const usable = points.length > 1 && values.every(Number.isFinite);
  const minimum = usable ? Math.min(...values) * 0.985 : 0,
    maximum = usable ? Math.max(...values) * 1.015 : 1;
  const start = points[0] ? Date.parse(points[0].timestamp) : 0,
    end = points.at(-1) ? Date.parse(points.at(-1)!.timestamp) : 1;
  const x = (p: RatioPoint) =>
    16 + ((Date.parse(p.timestamp) - start) / Math.max(1, end - start)) * 734;
  const y = (p: RatioPoint) =>
    200 -
    ((Number(p.pearsPerApple) - minimum) / Math.max(1, maximum - minimum)) *
      178;
  const segments: RatioPoint[][] = [];
  points.forEach((point, index) => {
    if (
      !index ||
      Date.parse(point.timestamp) - Date.parse(points[index - 1].timestamp) >
        1_800_000
    )
      segments.push([]);
    segments.at(-1)!.push(point);
  });
  return (
    <section className="panel chart-panel">
      <div className="section-heading">
        <div>
          <h2>The Pear Ratio</h2>
          <p className="small muted">
            AAPL token-equivalent value, measured in A2P.
          </p>
        </div>
        <div className="segmented" aria-label="History window">
          {[1, 7].map((days) => (
            <Button
              variant="ghost"
              key={days}
              aria-pressed={range === days}
              onClick={() => {
                setRange(days);
                setSelected(null);
              }}
            >
              {days === 1 ? "24H" : "7D"}
            </Button>
          ))}
        </div>
      </div>
      {usable ? (
        <>
          <div className="chart-readout">
            {selected
              ? `${amount(selected.pearsPerApple, 2)} Pears · ${new Date(selected.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC`
              : "Pears per Apple"}
          </div>
          <div className="chart-wrap">
            <svg
              className="ratio-chart"
              viewBox="0 0 830 230"
              role="img"
              aria-label={`Pear Ratio across ${points.length} recorded observations. Higher means more A2P per AAPL Stock Token.`}
              onMouseMove={(event) => {
                const box = event.currentTarget.getBoundingClientRect(),
                  localX = ((event.clientX - box.left) / box.width) * 830;
                setSelected(
                  points.reduce((best, point) =>
                    Math.abs(x(point) - localX) < Math.abs(x(best) - localX)
                      ? point
                      : best,
                  ),
                );
              }}
              onMouseLeave={() => setSelected(null)}
            >
              {[0, 1, 2, 3].map((index) => {
                const yy = 24 + index * 58;
                return (
                  <g key={index}>
                    <line
                      x1="16"
                      x2="750"
                      y1={yy}
                      y2={yy}
                      stroke="#e6e9e1"
                      strokeDasharray="3 5"
                    />
                    <text x="770" y={yy + 5} className="chart-label">
                      {amount(maximum - (index / 3) * (maximum - minimum), 0)}
                    </text>
                  </g>
                );
              })}
              {segments.map((segment, index) =>
                segment.length > 1 ? (
                  <polyline
                    key={index}
                    points={segment.map((p) => `${x(p)},${y(p)}`).join(" ")}
                    fill="none"
                    stroke="#47782e"
                    strokeWidth="2.6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                ) : (
                  <circle
                    key={index}
                    cx={x(segment[0])}
                    cy={y(segment[0])}
                    r="2.5"
                    fill="#47782e"
                  />
                ),
              )}
              {selected && (
                <g>
                  <line
                    x1={x(selected)}
                    x2={x(selected)}
                    y1="20"
                    y2="205"
                    stroke="#94a187"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx={x(selected)}
                    cy={y(selected)}
                    r="5"
                    fill="#b9ec61"
                    stroke="#31551e"
                    strokeWidth="2"
                  />
                </g>
              )}
              <text x="16" y="225" className="chart-label">
                {new Date(start).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}{" "}
                ·{" "}
                {new Date(start).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                  hour12: false,
                })}
              </text>
              <text x="750" y="225" textAnchor="end" className="chart-label">
                {new Date(end).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                  hour12: false,
                })}{" "}
                UTC
              </text>
            </svg>
          </div>
          <p className="small muted">
            A higher ratio means A2P is cheaper relative to the AAPL reference.
            Gaps over 30 minutes are left unconnected.
          </p>
        </>
      ) : (
        <EmptyState
          title="History starts with real observations."
          description={
            history.message ||
            "At least two fresh observations are needed. No historical prices are inferred or backfilled."
          }
        />
      )}
      <SourceNote value={history} />
    </section>
  );
}
