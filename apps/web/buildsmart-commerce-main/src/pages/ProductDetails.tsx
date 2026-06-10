// src/pages/ProductDetails.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProductDetail } from "@/hooks/useProducts";
import { ProductVariant } from "@/types/product";
import QuantitySelector from "@/components/cart/QuantitySelector";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

const ProductDetails = () => {
  const { id } = useParams();
  const { product, related, loading, error } = useProductDetail(Number(id));
  const { addToCart } = useCart();

  const [quantity, setQuantity]             = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // ── Derived values ───────────────────────────────────────────────────────────
  const activeVariant  = product?.has_variants ? selectedVariant : null;
  const displayPrice   = activeVariant?.price ?? product?.display_price ?? 0;
  const availableStock = activeVariant?.stock ?? product?.total_stock ?? 0;
  const inStock        = availableStock > 0;
  const canAddToCart   = inStock && (!product?.has_variants || selectedVariant !== null);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, activeVariant);
    setQuantity(1);
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-4">
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-8 w-1/4 animate-pulse rounded bg-muted" />
            <div className="h-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  // ── Not found / error ────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Product not found
        </h1>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src={product.image ?? "/placeholder-product.jpg"}
            alt={product.name}
            className="h-96 w-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <span className="text-sm font-medium text-gold">
            {product.category.name}
          </span>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl font-semibold text-foreground">
            {product.name}
          </h1>

          {/* Price */}
          <p className="mt-4 font-heading text-3xl font-semibold text-gold">
            ₦{displayPrice.toLocaleString()}
            {product.has_variants && !selectedVariant && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                (select a size)
              </span>
            )}
          </p>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>
              {inStock ? `${availableStock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Variant selector */}
          {product.has_variants && product.variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-foreground">
                Select Size / Variant
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.in_stock}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariant?.id === v.id
                        ? "border-gold bg-gold text-foreground"
                        : v.in_stock
                        ? "border-border bg-card text-foreground hover:border-gold"
                        : "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-50 line-through"
                    }`}
                  >
                    {v.size}
                    <span className="ml-1.5 text-xs opacity-70">
                      ₦{v.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              max={availableStock}
            />
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="gap-2 btn-gold border-0 font-semibold"
            >
              <ShoppingCart className="h-4 w-4" />
              {!inStock
                ? "Out of Stock"
                : product.has_variants && !selectedVariant
                ? "Select a Size"
                : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
            Related Products
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;