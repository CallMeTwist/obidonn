// src/components/motion/SplitReveal.tsx
import { Fragment, useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";

/**
 * Renders `text` as a heading with each word animating up on scroll-in.
 * `as` chooses the tag; `className` styles the wrapper.
 */
export function SplitReveal({
  text,
  className,
  as: Tag = "h2",
  stagger = 0.08,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>("[data-word]");
    if (reduced) {
      gsap.set(spans, { opacity: 1, y: 0 });
      return;
    }
    try {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          spans,
          { opacity: 0, y: "0.6em" },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      }, el);
      return () => ctx.revert();
    } catch {
      spans.forEach((s) => {
        s.style.opacity = "1";
        s.style.transform = "none";
      });
    }
  }, [reduced, stagger, text]);

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
            <span data-word style={{ display: "inline-block", opacity: 0 }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
