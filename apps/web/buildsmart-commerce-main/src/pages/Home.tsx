import { Link } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import CategoryCard from "@/components/product/CategoryCard";
import { Button } from "@/components/ui/button";
import { HomeHero } from "@/components/home/HomeHero";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { SectionHeading } from "@/components/services/SectionHeading";
import { StatCounter } from "@/components/brand/StatCounter";
import { Reveal } from "@/components/motion/Reveal";

const Home = () => {
  const { products: featured, loading: loadingFeatured } = useProducts({ featured: true });
  const { categories, loading: loadingCategories } = useCategories();

  return (
    <div className="theme-dark bg-background text-foreground">
      <HomeHero />
      <ServicesTeaser />

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <SectionHeading eyebrow="The store" title="Shop by category" className="mb-10 text-center md:text-left" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {loadingCategories
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)
            : categories.map((cat) => (
                <Reveal key={cat.id}>
                  <CategoryCard category={cat} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-card/40 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-end justify-between">
            <SectionHeading eyebrow="Curated" title="Featured products" />
            <Button asChild variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10">
              <Link to="/products">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingFeatured
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />)
              : featured.map((p) => (
                  <Reveal key={p.id}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="container mx-auto px-4 py-24 text-center">
        <SectionHeading eyebrow="Why DONNS" title="Design. Supply. Build." className="mx-auto max-w-2xl" />
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-8">
          <StatCounter value={18} suffix="+" label="Years" />
          <StatCounter value={240} label="Projects" />
          <StatCounter value={5000} suffix="+" label="Products" />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-24 text-center">
          <SectionHeading eyebrow="Start building" title="Ready to build in gold standard?" className="mx-auto max-w-2xl" />
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild size="lg" className="btn-gold border-0 font-semibold">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
