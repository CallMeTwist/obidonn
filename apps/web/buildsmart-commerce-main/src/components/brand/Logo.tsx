import { Link } from "react-router-dom";
import logo from "@/assets/brand/logo-donns.jpeg";
import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)}>
      <img
        src={logo}
        alt="DONNS"
        className="h-9 w-9 rounded-md object-cover ring-1 ring-gold/40"
      />
      {showWordmark && (
        <span className="font-heading text-2xl font-semibold tracking-[0.22em] leading-none">
          DON<span className="text-gold">N</span>S
        </span>
      )}
    </Link>
  );
}
