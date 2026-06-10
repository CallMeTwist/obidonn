// src/lib/animation/SmoothScrollProvider.tsx
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";
import { lenisRef } from "@/lib/animation/lenisInstance";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // native scrolling, no smoothing

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Recompute trigger positions once late-loading media (images, video posters)
    // settle, so reveal animations don't get stuck with stale start points.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const settle = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(settle);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
