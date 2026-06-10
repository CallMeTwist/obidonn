import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  onChange: (q: number) => void;
  max?: number;
};

const QuantitySelector = ({ quantity, onChange, max = 999 }: Props) => (
  <div className="flex items-center gap-1 rounded-md border border-border">
    <button
      onClick={() => onChange(Math.max(1, quantity - 1))}
      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <Minus className="h-3.5 w-3.5" />
    </button>
    <span className="w-8 text-center text-sm font-medium text-foreground">{quantity}</span>
    <button
      onClick={() => onChange(Math.min(max, quantity + 1))}
      className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  </div>
);

export default QuantitySelector;
