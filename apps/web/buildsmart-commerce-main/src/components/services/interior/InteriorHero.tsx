// src/components/services/interior/InteriorHero.tsx
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SplitReveal } from "@/components/motion/SplitReveal";
import poster from "@/assets/brand/pin2.jpg";

export function InteriorHero() {
  return (
    <section className="relative h-screen overflow-hidden">
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
        <source src="/media/decor.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

      <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-24">
        <Eyebrow>Interior Design</Eyebrow>
        <SplitReveal
          as="h1"
          text="Interiors that feel like home, finished like a gallery."
          className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-[1.06] sm:text-5xl md:text-7xl"
        />
        <p className="eyebrow mt-8 text-muted-foreground">↓ scroll to explore</p>
      </div>
    </section>
  );
}
