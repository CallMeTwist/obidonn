// src/components/services/architectural/ArchHero.tsx
import { Eyebrow } from "@/components/brand/Eyebrow";
import { GoldButton } from "@/components/brand/GoldButton";
import { Button } from "@/components/ui/button";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { scrollToId } from "@/lib/animation/lenisInstance";
import poster from "@/assets/brand/arch.jpeg";

export function ArchHero() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        {/* Palindrome encode (forward + reversed) so the loop plays out and back smoothly. */}
        <source src="/media/for-architectural-loop.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/25" />

      <div className="container relative z-10 mx-auto px-4 pb-20">
        <Eyebrow>Architectural Consultation</Eyebrow>
        <SplitReveal
          as="h1"
          text="Spaces engineered to inspire."
          className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-7xl"
        />
        <Reveal delay={0.3} className="mt-6 max-w-xl text-lg text-muted-foreground">
          From first sketch to final structure — DONNS designs buildings that command attention and stand for generations.
        </Reveal>
        <Reveal delay={0.45} className="mt-8 flex flex-wrap gap-4">
          <GoldButton size="lg" onClick={() => scrollToId("book")}>
            Book a Consultation
          </GoldButton>
          <Button
            variant="outline"
            size="lg"
            className="border-foreground/30 text-foreground hover:bg-foreground/10"
            onClick={() => scrollToId("portfolio")}
          >
            View Portfolio
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
