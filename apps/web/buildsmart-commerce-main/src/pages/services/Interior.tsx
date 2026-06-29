import { InteriorHero } from "@/components/services/interior/InteriorHero";
import { SectionHeading } from "@/components/services/SectionHeading";
import { BookingForm } from "@/components/services/BookingForm";
import { Reveal } from "@/components/motion/Reveal";
import { Hairline } from "@/components/brand/Hairline";
import showcase from "@/assets/brand/pin2.jpg";
import living from "@/assets/brand/interior-living.jpg";
import int1 from "@/assets/brand/portfolio/interior/interior-1.jpeg";
import int2 from "@/assets/brand/portfolio/interior/interior-2.jpeg";
import int3 from "@/assets/brand/portfolio/interior/interior-3.jpeg";
import int4 from "@/assets/brand/portfolio/interior/interior-4.jpeg";
import int5 from "@/assets/brand/portfolio/interior/interior-5.jpeg";
import int6 from "@/assets/brand/portfolio/interior/interior-6.jpeg";
import int7 from "@/assets/brand/portfolio/interior/interior-7.jpeg";
import int8 from "@/assets/brand/portfolio/interior/interior-8.jpeg";
import int9 from "@/assets/brand/portfolio/interior/interior-9.jpeg";
import int10 from "@/assets/brand/portfolio/interior/interior-10.jpeg";

const services = [
  { t: "Space planning & styling", d: "Layouts that flow around how you actually live." },
  { t: "Custom furniture & joinery", d: "Bespoke pieces made to your space and taste." },
  { t: "Lighting & ambiance", d: "Layered light that shifts with the time of day." },
  { t: "Material, color & texture", d: "Curated palettes with a tactile, warm finish." },
  { t: "Full project management", d: "We handle trades, timelines and installation." },
];

const portfolioTiles = [int1, int2, int3, int4, int5, int6, int7, int8, int9, int10];

const Interior = () => (
  <div className="theme-dark bg-background text-foreground">
    <InteriorHero />

    {/* Services over a dark section */}
    <section className="container mx-auto px-4 py-24">
      <SectionHeading eyebrow="Our décor services" title="From mood to move-in" className="max-w-2xl" />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Reveal key={s.t} className="rounded-2xl border border-border bg-card/60 p-7 backdrop-blur">
            <h3 className="font-heading text-2xl">{s.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>

    {/* Living spaces feature */}
    <section className="container mx-auto grid items-center gap-10 px-4 pb-24 md:grid-cols-2">
      <Reveal className="overflow-hidden rounded-2xl border border-border">
        <img
          src={living}
          alt="Styled living room with layered lighting and warm textures"
          className="h-full w-full object-cover"
        />
      </Reveal>
      <div>
        <SectionHeading eyebrow="Living spaces" title="Considered down to the detail" />
        <p className="mt-6 max-w-md text-muted-foreground">
          From the ceiling line to the floor finish, we compose each room as one piece — feature
          walls, joinery, layered lighting and the textures you reach for every day. The result is a
          space that looks designed and feels effortless.
        </p>
      </div>
    </section>

    {/* pin2 showcase */}
    <section className="relative h-[80vh] overflow-hidden">
      <img src={showcase} alt="Featured interior project" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-16">
        <p className="eyebrow text-gold-light">Featured project</p>
        <h3 className="mt-2 font-heading text-4xl md:text-5xl">The Ridge Residence</h3>
      </div>
    </section>

    {/* Portfolio */}
    <section id="portfolio" className="container mx-auto px-4 pb-24">
      <SectionHeading eyebrow="Selected work" title="Interiors we've shaped" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolioTiles.map((img, i) => (
          <Reveal key={i} className="group overflow-hidden rounded-xl border border-border">
            <img
              src={img}
              alt={`Interior project ${i + 1}`}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Reveal>
        ))}
      </div>
    </section>

    {/* Booking */}
    <section id="book" className="border-t border-border bg-card/40">
      <div className="container mx-auto grid gap-12 px-4 py-24 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Let's design yours" title="Book a design consultation" />
          <Hairline className="my-8 max-w-xs" />
          <p className="max-w-md text-muted-foreground">
            Share your space and the feeling you're after. Our designers will follow up to begin.
          </p>
        </div>
        <BookingForm serviceType="interior" />
      </div>
    </section>
  </div>
);

export default Interior;
