import { Link } from "react-router-dom";
import {
  Layers, Square, Home, Zap, Droplets,
  Wrench, Paintbrush, DoorOpen, Package
} from "lucide-react";
import { Category } from "@/types/product";

// Maps category slug → icon component
const categoryIcons: Record<string, React.ElementType> = {
  "cement-concrete":    Layers,
  "bricks-blocks":      Square,
  "roofing-materials":  Home,
  "electrical-supplies": Zap,
  "plumbing-materials": Droplets,
  "tools-equipment":    Wrench,
  "paints-finishes":    Paintbrush,
  "doors-windows":      DoorOpen,
};

interface Props {
  category: Category;
}

const CategoryCard = ({ category }: Props) => {
  const Icon = categoryIcons[category.slug] ?? Package; // fallback icon

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-gold hover:shadow-md card-shadow"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <span className="font-heading text-sm font-semibold text-foreground">
        {category.name}
      </span>
      {category.product_count !== undefined && (
        <span className="mt-1 text-xs text-muted-foreground">
          {category.product_count} products
        </span>
      )}
    </Link>
  );
};

export default CategoryCard;