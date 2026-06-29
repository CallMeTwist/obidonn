import { ArchHero } from "@/components/services/architectural/ArchHero";
import { SectionHeading } from "@/components/services/SectionHeading";
import { BookingForm } from "@/components/services/BookingForm";
import { StatCounter } from "@/components/brand/StatCounter";
import { Reveal } from "@/components/motion/Reveal";
import { Hairline } from "@/components/brand/Hairline";
import archImage from "@/assets/brand/arch.jpeg";
import pinImage from "@/assets/brand/pin.jpg";
import sketchImage from "@/assets/brand/arch-sketch.jpg";
import arch1 from "@/assets/brand/portfolio/arch/arch-1.jpeg";
import arch2 from "@/assets/brand/portfolio/arch/arch-2.jpeg";
import arch3 from "@/assets/brand/portfolio/arch/arch-3.jpeg";
import arch4 from "@/assets/brand/portfolio/arch/arch-4.jpeg";

const services = [
  "Site & feasibility analysis",
  "Concept & 3D massing",
  "Construction drawings",
  "Permitting & approvals",
  "Build supervision",
];

const steps = [
  { n: "01", t: "Consult", d: "We listen to your vision, site and budget." },
  { n: "02", t: "Concept", d: "Mood, massing and 3D walkthroughs." },
  { n: "03", t: "Construct", d: "Documentation, permits and on-site supervision." },
];

const portfolioTiles = [arch1, arch2, arch3, arch4];

const Architectural = () => (
  <div className="theme-dark bg-background text-foreground">
    <ArchHero />

    {/* Stats */}
    <section className="border-y border-border">
      <div className="container mx-auto grid grid-cols-3 gap-6 px-4 py-14">
        <StatCounter value={18} suffix="+" label="Years" />
        <StatCounter value={240} label="Projects" />
        <StatCounter value={12} label="Awards" />
      </div>
    </section>

    {/* Split: floor plan + services */}
    <section className="container mx-auto grid items-center gap-10 px-4 py-24 md:grid-cols-2">
      <Reveal>
        <img src={pinImage} alt="Architectural floor plan" className="w-full rounded-2xl border border-border object-cover" />
      </Reveal>
      <div>
        <SectionHeading eyebrow="What we do" title="Concept to blueprint" />
        <ul className="mt-8 space-y-4">
          {services.map((s) => (
            <li key={s} className="flex items-start gap-3 text-muted-foreground">
              <span className="mt-1 text-gold">›</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Hand-drawn origins */}
    <section className="container mx-auto grid items-center gap-10 px-4 pb-24 md:grid-cols-2">
      <div className="order-2 md:order-1">
        <SectionHeading eyebrow="The craft" title="Every build begins as a drawing" />
        <p className="mt-6 max-w-md text-muted-foreground">
          Before a single block is laid, our architects sketch proportion, light and flow by hand —
          refining the idea until the lines feel inevitable. Those drawings become the precise
          documentation your build is measured against.
        </p>
      </div>
      <Reveal className="order-1 rounded-2xl border border-border bg-card p-4 md:order-2">
        <img
          src={sketchImage}
          alt="Hand-drawn architectural sketch of a two-storey house"
          className="w-full rounded-xl object-contain"
        />
      </Reveal>
    </section>

    {/* Full-bleed premium image */}
    <section className="relative h-[60vh] overflow-hidden">
      <img src={archImage} alt="DONNS architecture" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </section>

    {/* Process */}
    <section className="container mx-auto px-4 py-24">
      <SectionHeading eyebrow="The process" title="How we build with you" className="max-w-2xl" />
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border md:grid-cols-3">
        {steps.map((s) => (
          <Reveal key={s.n} className="bg-card p-8">
            <div className="font-heading text-4xl font-semibold text-gold">{s.n}</div>
            <h3 className="mt-4 font-heading text-2xl">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Portfolio (placeholder tiles) */}
    <section id="portfolio" className="container mx-auto px-4 pb-24">
      <SectionHeading eyebrow="Selected work" title="A portfolio of permanence" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioTiles.map((img, i) => (
          <Reveal key={i} className="group overflow-hidden rounded-xl border border-border">
            <img src={img} alt={`Project ${i + 1}`} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">A selection of recent work.</p>
    </section>

    {/* Booking */}
    <section id="book" className="border-t border-border bg-card/40">
      <div className="container mx-auto grid gap-12 px-4 py-24 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Start your project" title="Book a consultation" />
          <Hairline className="my-8 max-w-xs" />
          <p className="max-w-md text-muted-foreground">
            Tell us about your site and ambitions. Our architects will reach out to schedule your first session.
          </p>
        </div>
        <BookingForm serviceType="architectural" />
      </div>
    </section>
  </div>
);

export default Architectural;
