import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // don't follow the card link

    if (product.has_variants) {
      // Variant product — go to detail page so user can pick size
      navigate(`/products/${product.id}`);
      return;
    }

    // Simple product — add directly with no variant
    addToCart(product, 1, null);
  };

  const inStock = product.in_stock;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-shadow card-shadow hover:card-shadow-hover"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted">
        <img
          src={product.image ?? "/placeholder-product.jpg"}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
              Out of Stock
            </span>
          </div>
        )}
        {product.is_featured && inStock && (
          <span className="absolute left-2 top-2 rounded-full btn-gold px-2 py-0.5 text-xs font-medium">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-gold">
          {product.category.name}
        </p>
        <h3 className="mt-1 font-heading font-semibold text-foreground line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              ₦{product.display_price.toLocaleString()}
            </p>
            {product.has_variants && (
              <p className="text-xs text-muted-foreground">from</p>
            )}
          </div>

          <Button
            size="sm"
            variant={product.has_variants ? "outline" : "default"}
            onClick={handleCartClick}
            disabled={!inStock}
            className="shrink-0 gap-1.5"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.has_variants ? "Select" : "Add"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;