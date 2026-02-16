"use client";

import type { ClientPresentationData } from "@/types";
import { cn } from "@/lib/utils";

export interface PerformanceScreenProps {
  data: ClientPresentationData;
  speakerNotes?: string;
  className?: string;
}

function formatReturn(value: number): string {
  const sign = value >= 0 ? "" : "-";
  return `${sign}${Math.abs(value)}%`;
}

export function PerformanceScreen({
  data,
  speakerNotes,
  className,
}: PerformanceScreenProps) {
  const performance = data.performance;
  const items = performance?.items ?? [];
  const hasData = items.length > 0;

  return (
    <div
      className={cn("flex flex-col", className)}
      aria-label="Performance"
    >
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Performance
      </h2>
      {!hasData ? (
        <p className="mt-4 text-muted-foreground">
          No performance data available for this client.
        </p>
      ) : (
        <ul className="mt-6 space-y-3" role="list">
          {items.map((item, i) => (
            <li
              key={`${item.period}-${i}`}
              className="flex items-center justify-between border-b border-border py-2 last:border-0"
            >
              <span>{item.period}</span>
              <span
                className={cn(
                  "font-medium tabular-nums",
                  item.return >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {formatReturn(item.return)}
              </span>
            </li>
          ))}
        </ul>
      )}
      {speakerNotes && (
        <p className="sr-only" aria-live="polite">
          Speaker notes: {speakerNotes}
        </p>
      )}
    </div>
  );
}
