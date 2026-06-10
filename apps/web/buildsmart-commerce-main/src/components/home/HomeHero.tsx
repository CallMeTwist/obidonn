// src/components/home/HomeHero.tsx
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { GoldButton } from "@/components/brand/GoldButton";
import { useReducedMotion } from "@/lib/animation/useReducedMotion";
import { cn } from "@/lib/utils";
import construction from "@/assets/hero-construction.jpg";
import decor from "@/assets/brand/decor-living.jpg";
import architect from "@/assets/brand/architect-planning.webp";

type Slide = {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; to: string };
};

const slides: Slide[] = [
  {
    image: construction,
    alt: "DONNS construction project",
    eyebrow: "Build · Materials",
    title: "Build in gold standard.",
    body: "Premium building materials, sourced and supplied end to end — from foundation to finishing touch.",
    cta: { label: "Shop Materials", to: "/products" },
  },
  {
    image: decor,
    alt: "Warm modern living room interior",
    eyebrow: "Interior Design",
    title: "Interiors that feel like home.",
    body: "Bespoke décor, furniture and styling — spaces curated down to the last texture and shade.",
    cta: { label: "Explore Interior Design", to: "/services/interior" },
  },
  {
    image: architect,
    alt: "Architects planning over blueprints",
    eyebrow: "Architectural Consultation",
    title: "Designed to stand for generations.",
    body: "From first sketch to final structure — architecture engineered to inspire and endure.",
    cta: { label: "Book a Consultation", to: "/services/architectural" },
  },
];

const AUTOPLAY_MS = 6000;

export function HomeHero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), []);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  const active = slides[index];

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label="DONNS services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cross-fading background images */}
      {slides.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt={s.alt}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/55 to-background" />

      {/* Active slide content (re-animates on change) */}
      <div className="container relative z-10 mx-auto px-4">
        <div key={index} className="max-w-4xl animate-reveal-up">
          <Eyebrow>{active.eyebrow}</Eyebrow>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.04] sm:text-6xl md:text-8xl">
            {active.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{active.body}</p>
          <div className="mt-8">
            <GoldButton asChild size="lg">
              <Link to={active.cta.to}>
                {active.cta.label} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </GoldButton>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-foreground/20 bg-background/40 p-2 text-foreground backdrop-blur transition-colors hover:border-gold hover:text-gold md:block"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-foreground/20 bg-background/40 p-2 text-foreground backdrop-blur transition-colors hover:border-gold hover:text-gold md:block"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-gold" : "w-2 bg-foreground/40 hover:bg-foreground/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
