import { cn } from "@/lib/utils";

export function Hairline({ className }: { className?: string }) {
  return <span className={cn("block h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent", className)} />;
}
