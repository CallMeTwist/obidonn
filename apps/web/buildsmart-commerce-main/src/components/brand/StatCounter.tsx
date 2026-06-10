import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";

export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useLayoutEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => setDisplay(Math.round(obj.n)),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl font-semibold text-gold-light md:text-5xl">
        {display}
        {suffix}
      </div>
      <div className="eyebrow mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}
