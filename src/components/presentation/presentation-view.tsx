"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useClientData } from "@/lib/hooks/useClientData";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { DEFAULT_SCREEN_ORDER } from "./screen-order";
import type { ClientPresentationData } from "@/types";
import { Button } from "@/components/ui/button";

interface PresentationViewProps {
  clientId: string;
  showSpeakerNotes?: boolean;
}

export function PresentationView({
  clientId,
  showSpeakerNotes = false,
}: PresentationViewProps) {
  const { client, data, loading, error } = useClientData(clientId);
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReady = !loading && !error;
  useFocusTrap(containerRef, isReady);

  const screens = DEFAULT_SCREEN_ORDER;
  const total = screens.length;
  const canGoNext = index < total - 1;
  const canGoPrev = index > 0;

  const goNext = useCallback(() => {
    setIndex((i) => (i < total - 1 ? i + 1 : i));
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
        <p className="text-muted-foreground">Loading presentation...</p>
        <Button asChild variant="outline">
          <Link href="/clients">Exit</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-center text-destructive">
          Failed to load client: {error.message}
        </p>
        <Button asChild variant="outline">
          <Link href="/clients">Back to clients</Link>
        </Button>
      </div>
    );
  }

  const presentationData: ClientPresentationData = data ?? {};
  const config = screens[index];
  const CurrentScreen = config.component;

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen flex-col bg-background"
      role="region"
      aria-label={`Presentation: ${client?.name ?? "Client"}. Slide ${index + 1} of ${total}, ${config.label}. Use Next and Previous to move, or Exit to leave.`}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {index + 1} of {total}: {config.label}
      </p>

      <main className="flex flex-1 flex-col" id="presentation-main">
        <div className="flex min-h-[70vh] flex-1 flex-col px-8 py-12">
          <CurrentScreen
            data={presentationData}
            speakerNotes={showSpeakerNotes ? config.speakerNotes : undefined}
            className="flex-1"
          />
        </div>

        {showSpeakerNotes && config.speakerNotes && (
          <aside
            className="border-t bg-muted/30 px-8 py-4 text-sm text-muted-foreground"
            aria-label="Speaker notes"
          >
            {config.speakerNotes}
          </aside>
        )}
      </main>

      <footer className="flex flex-col gap-3 border-t bg-background px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-4 md:py-6">
        <div className="flex justify-center gap-2 sm:justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Previous screen"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Next screen"
          >
            Next
          </Button>
        </div>
        <p
          className="text-center text-sm text-muted-foreground sm:text-left"
          aria-live="polite"
        >
          {index + 1} of {total}
        </p>
        <div className="flex justify-center sm:justify-end">
          <Button asChild variant="ghost" size="sm" aria-label="Exit presentation">
            <Link href="/clients">Exit</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
