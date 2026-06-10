import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Hairline } from "@/components/brand/Hairline";

const Footer = () => (
  <footer className="theme-dark bg-background text-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid gap-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Design. Supply. Build. Premium building materials and bespoke architectural &amp; interior design — end to end.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-foreground">Explore</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/products" className="transition-colors hover:text-gold">Shop</Link>
            <Link to="/about" className="transition-colors hover:text-gold">About</Link>
            <Link to="/contact" className="transition-colors hover:text-gold">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-foreground">Services</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/services/architectural" className="transition-colors hover:text-gold">Architectural Consultation</Link>
            <Link to="/services/interior" className="transition-colors hover:text-gold">Interior Design</Link>
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-4 text-foreground">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +234 800 000 0000</span>
            <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@donns.com</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Lagos, Nigeria</span>
          </div>
        </div>
      </div>

      <Hairline className="mt-12" />
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} DONNS. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
