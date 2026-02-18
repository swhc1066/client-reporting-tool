"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
}

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active = true
): void {
  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      const container = containerRef.current;
      if (!container) return;

      const focusables = getFocusables(container);
      const first = focusables[0];
      if (first) first.focus();

      function handleKeyDown(e: KeyboardEvent) {
        if (e.key !== "Tab") return;
        const current = containerRef.current;
        if (!current) return;
        const list = getFocusables(current);
        if (list.length === 0) return;
        const firstEl = list[0];
        const lastEl = list[list.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }

      container.addEventListener("keydown", handleKeyDown);
      cleanup = () => container.removeEventListener("keydown", handleKeyDown);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      cleanup?.();
    };
  }, [containerRef, active]);
}
