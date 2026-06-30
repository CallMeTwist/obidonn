import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/brand/Logo";
import { darkHeroRoutes } from "@/components/layout/navRoutes";
import { cn } from "@/lib/utils";

const services = [
  { to: "/services/architectural", label: "Architectural Consultation" },
  { to: "/services/interior", label: "Interior Design" },
];

const primary = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number>();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { totalItems } = useCart();
  const location = useLocation();

  const overDarkHero = darkHeroRoutes.includes(location.pathname);
  const solid = scrolled || !overDarkHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Cleanup hover-delay timer on unmount to prevent timer leak
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const openServices = () => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 120);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape" && servicesOpen) {
      e.preventDefault();
      setServicesOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setServicesOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <nav
      className={cn(
        "theme-dark fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-gradient-to-b from-background/85 via-background/45 to-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4 text-foreground">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {primary.slice(0, 2).map((link) => (
            <NavItem key={link.to} {...link} active={location.pathname === link.to} />
          ))}

          <div className="relative" onMouseEnter={openServices} onMouseLeave={scheduleClose}>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              onKeyDown={handleTriggerKeyDown}
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
            >
              Services <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {servicesOpen && (
              <div
                role="menu"
                className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-2xl"
                onMouseEnter={openServices}
                onMouseLeave={scheduleClose}
                onKeyDown={handleMenuKeyDown}
              >
                {services.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    role="menuitem"
                    className="block rounded-lg px-4 py-3 text-sm text-card-foreground/85 transition-colors hover:bg-secondary hover:text-gold"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {primary.slice(2).map((link) => (
            <NavItem key={link.to} {...link} active={location.pathname === link.to} />
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-foreground transition-colors hover:text-gold">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full btn-gold text-[10px] font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => {
              setMobileOpen((v) => !v);
              setMobileServicesOpen(false);
            }}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="p-2 text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="theme-dark border-t border-border bg-background px-4 pb-6 text-foreground md:hidden">
          {[primary[0], primary[1]].map((l) => (
            <MobileLink key={l.to} {...l} onClose={() => setMobileOpen(false)} />
          ))}

          <button
            type="button"
            aria-expanded={mobileServicesOpen}
            aria-controls="mobile-services"
            onClick={() => setMobileServicesOpen((v) => !v)}
            className="flex w-full items-center justify-between py-3 transition-colors hover:text-gold"
          >
            <span className="eyebrow text-muted-foreground">Services</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-300 ease-out",
                mobileServicesOpen && "rotate-180 text-gold",
              )}
            />
          </button>

          <div
            id="mobile-services"
            className={cn(
              "grid transition-all duration-300 ease-out",
              mobileServicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="ml-1 border-l border-border/60 pl-3">
                {services.map((s) => (
                  <MobileLink key={s.to} {...s} onClose={() => setMobileOpen(false)} />
                ))}
              </div>
            </div>
          </div>

          {[primary[2], primary[3]].map((l) => (
            <MobileLink key={l.to} {...l} onClose={() => setMobileOpen(false)} />
          ))}
        </div>
      )}
    </nav>
  );
};

function NavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-gold",
        active ? "text-gold" : "text-foreground/80",
      )}
    >
      {label}
    </Link>
  );
}

function MobileLink({ to, label, onClose }: { to: string; label: string; onClose: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="block py-3 text-sm font-medium text-foreground/85 hover:text-gold"
    >
      {label}
    </Link>
  );
}

export default Navbar;
