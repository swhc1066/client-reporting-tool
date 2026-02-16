"use client";

import type { ClientPresentationData } from "@/types";
import { cn } from "@/lib/utils";

export interface AllocationScreenProps {
  data: ClientPresentationData;
  speakerNotes?: string;
  className?: string;
}

export function AllocationScreen({
  data,
  speakerNotes,
  className,
}: AllocationScreenProps) {
  const allocation = data.allocation;
  const items = allocation?.items ?? [];
  const total = allocation?.total;
  const hasData = items.length > 0;

  return (
    <div
      className={cn("flex flex-col", className)}
      aria-label="Portfolio allocation"
    >
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Allocation
      </h2>
      {!hasData ? (
        <p className="mt-4 text-muted-foreground">
          No allocation data available for this client.
        </p>
      ) : (
        <>
          <ul className="mt-6 space-y-3" role="list">
            {items.map((item, i) => (
              <li
                key={`${item.label}-${i}`}
                className="flex items-center justify-between border-b border-border py-2 last:border-0"
              >
                <span>{item.label}</span>
                <span className="font-medium tabular-nums">{item.value}%</span>
              </li>
            ))}
          </ul>
          {total != null && (
            <p className="mt-4 text-sm text-muted-foreground">
              Total: {total}%
            </p>
          )}
        </>
      )}
      {speakerNotes && (
        <p className="sr-only" aria-live="polite">
          Speaker notes: {speakerNotes}
        </p>
      )}
    </div>
  );
}
