import { Building2, Target, Award, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/brand/Eyebrow";
import ceoImage from "@/assets/ceo-portrait.jpeg";

const About = () => (
  <div>
    {/* Dark editorial hero */}
    <section className="theme-dark bg-background py-20">
      <div className="container mx-auto px-4 text-center text-foreground">
        <Eyebrow>Our story</Eyebrow>
        <h1 className="mt-3 font-heading text-4xl md:text-5xl font-semibold text-foreground">About DONNS</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Design. Supply. Build. Premium building materials and bespoke architectural &amp; interior design — end to end.
        </p>
      </div>
    </section>

    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">Our Story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Founded by High Chief Obinna Anieke, DONNS was built on a simple conviction: exceptional spaces begin long before the first brick is laid. Over 18 years we have evolved into a fully integrated design, supply, and build firm — guiding clients from initial concept through architectural design, curated material specification, and on-site delivery.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our portfolio spans residential, commercial, and hospitality projects across Nigeria. Whether you are commissioning a bespoke interior or sourcing premium finishing materials, every DONNS engagement is shaped by the same standard: precision, craft, and uncompromising quality.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Building2, num: "18+", label: "Years Experience" },
            { icon: Users, num: "50K+", label: "Happy Customers" },
            { icon: Award, num: "5000+", label: "Products" },
            { icon: Target, num: "99%", label: "Satisfaction Rate" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.1} className="rounded-lg border border-border bg-card p-6 text-center card-shadow">
              <stat.icon className="mx-auto h-6 w-6 text-gold" />
              <p className="mt-2 font-heading text-2xl font-semibold text-foreground">{stat.num}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">Our Mission</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          To be Nigeria's most trusted design and build partner — delivering end-to-end solutions that unite architectural vision, interior excellence, and premium materials under one roof, so every client builds with absolute confidence.
        </p>
      </div>
    </section>

    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">Meet Our Leadership</h2>
        <p className="mt-2 text-muted-foreground">Guiding DONNS with vision and expertise</p>
      </div>
      <Reveal className="max-w-2xl mx-auto">
        <div className="rounded-lg border border-border bg-card overflow-hidden card-shadow">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div>
              <img
                src={ceoImage}
                alt="CEO Portrait"
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>
            <div className="text-left">
              <div className="mb-4">
                <p className="eyebrow text-gold">Chief Executive Officer</p>
                <h3 className="font-heading text-3xl font-semibold text-foreground mt-2">High Chief Obinna Anieke</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                With over 18 years of experience in the building materials and design industry, Donn founded DONNS on a mission to deliver gold-standard materials and bespoke design services. His commitment to excellence and customer satisfaction has shaped every aspect of the business.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Donn believes that success comes from understanding our customers' needs and exceeding their expectations at every stage — from the first consultation to the finishing touch.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  </div>
);

export default About;
