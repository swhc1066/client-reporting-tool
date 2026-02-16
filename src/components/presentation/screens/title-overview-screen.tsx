"use client";

import type { ClientPresentationData } from "@/types";
import { cn } from "@/lib/utils";

export interface TitleOverviewScreenProps {
  data: ClientPresentationData;
  speakerNotes?: string;
  className?: string;
}

export function TitleOverviewScreen({
  data,
  speakerNotes,
  className,
}: TitleOverviewScreenProps) {
  const overview = data.overview;
  const title = overview?.clientName ?? "Client overview";
  const subtitle = overview?.subtitle;
  const asOf = overview?.asOfDate;

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col justify-center text-center",
        className
      )}
      aria-label="Title and overview"
    >
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
      )}
      {asOf && (
        <p className="mt-4 text-sm text-muted-foreground">As of {asOf}</p>
      )}
      {speakerNotes && (
        <p className="sr-only" aria-live="polite">
          Speaker notes: {speakerNotes}
        </p>
      )}
    </div>
  );
}
