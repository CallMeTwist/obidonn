// src/components/motion/Reveal.tsx
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";

export function Reveal({
  children,
  className,
  y = 28,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    try {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      }, el);
      return () => ctx.revert();
    } catch {
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  }, [reduced, y, delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
