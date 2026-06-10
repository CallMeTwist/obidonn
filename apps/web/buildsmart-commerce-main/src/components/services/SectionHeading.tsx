// src/components/services/SectionHeading.tsx
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SplitReveal as="h2" text={title} className="mt-3 font-heading text-3xl font-semibold md:text-5xl" />
    </div>
  );
}
