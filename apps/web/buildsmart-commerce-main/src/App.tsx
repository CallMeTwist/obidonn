import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import { darkHeroRoutes } from "@/components/layout/navRoutes";
import Footer from "@/components/layout/Footer";
import AppRouter from "@/routes/AppRouter";
import { SmoothScrollProvider } from "@/lib/animation/SmoothScrollProvider";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

// The navbar is fixed (overlays full-bleed heroes), so non-hero pages need
// top padding equal to the bar height to avoid tucking content under it.
const Shell = () => {
  const { pathname } = useLocation();
  const overHero = darkHeroRoutes.includes(pathname);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={cn("flex-1", !overHero && "pt-[68px]")}>
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SmoothScrollProvider>
            <Shell />
          </SmoothScrollProvider>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
