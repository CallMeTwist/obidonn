import { forwardRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const GoldButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "btn-gold border-0 font-semibold tracking-wide hover:brightness-110 hover:shadow-[0_8px_30px_hsl(43_57%_50%/0.35)]",
        className,
      )}
      {...props}
    />
  ),
);
GoldButton.displayName = "GoldButton";
