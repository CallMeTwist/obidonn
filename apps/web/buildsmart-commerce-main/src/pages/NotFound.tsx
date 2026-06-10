import { Link } from "react-router-dom";
import { GoldButton } from "@/components/brand/GoldButton";

const NotFound = () => (
  <div className="theme-dark flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center text-foreground">
    <p className="font-heading text-8xl font-semibold text-gold">404</p>
    <p className="mt-4 text-muted-foreground">This page wandered off the blueprint.</p>
    <GoldButton asChild size="lg" className="mt-8">
      <Link to="/">Back home</Link>
    </GoldButton>
  </div>
);

export default NotFound;
