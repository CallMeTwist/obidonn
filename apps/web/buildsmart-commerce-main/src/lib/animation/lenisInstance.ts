// src/lib/animation/lenisInstance.ts
// Shared Lenis instance holder — populated by SmoothScrollProvider when active.
import type Lenis from "lenis";

export const lenisRef: { current: Lenis | null } = { current: null };

/**
 * Smooth-scroll to a same-page section by its element id.
 * Uses Lenis when available; falls back to native scrollIntoView.
 */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { offset: -80 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
