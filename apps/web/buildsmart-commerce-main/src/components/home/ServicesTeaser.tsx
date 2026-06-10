// src/components/home/ServicesTeaser.tsx
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import arch from "@/assets/brand/arch.jpeg";
import interior from "@/assets/brand/pin2.jpg";

const tiles = [
  { to: "/services/architectural", img: arch, eyebrow: "Service", title: "Architectural Consultation", d: "Concept to blueprint to build." },
  { to: "/services/interior", img: interior, eyebrow: "Service", title: "Interior Design", d: "Décor that feels like home." },
];

export function ServicesTeaser() {
  return (
    <section className="container mx-auto grid gap-6 px-4 py-24 md:grid-cols-2">
      {tiles.map((t) => (
        <Reveal key={t.to} className="h-[60vh]">
          <Link to={t.to} className="group relative block h-full overflow-hidden rounded-3xl border border-border">
            <img src={t.img} alt={t.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="eyebrow text-gold-light">{t.eyebrow}</p>
              <h3 className="mt-2 flex items-center gap-2 font-heading text-3xl md:text-4xl">
                {t.title} <ArrowUpRight className="h-6 w-6 text-gold transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.d}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
