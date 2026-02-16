"use client";

import type { ClientPresentationData } from "@/types";
import { cn } from "@/lib/utils";

export interface SummaryScreenProps {
  data: ClientPresentationData;
  speakerNotes?: string;
  className?: string;
}

export function SummaryScreen({
  data,
  speakerNotes,
  className,
}: SummaryScreenProps) {
  const summary = data.summary;
  const highlights = summary?.highlights ?? [];
  const hasData = highlights.length > 0;

  return (
    <div
      className={cn("flex flex-col", className)}
      aria-label="Summary and highlights"
    >
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Summary
      </h2>
      {!hasData ? (
        <p className="mt-4 text-muted-foreground">
          No summary highlights for this client.
        </p>
      ) : (
        <ul className="mt-6 list-disc space-y-2 pl-5 text-muted-foreground">
          {highlights.map((text, i) => (
            <li key={i}>{text}</li>
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
