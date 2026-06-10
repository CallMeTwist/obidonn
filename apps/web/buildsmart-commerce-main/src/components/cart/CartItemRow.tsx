import { Trash2 } from "lucide-react";
import { CartItem } from "@/types/product";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "@/context/CartContext";

interface Props {
  item: CartItem;
}

const CartItemRow = ({ item }: Props) => {
  const { removeFromCart, updateQuantity } = useCart();

  // Unique key logic — variant items differ by variant id
  const variantId = item.variant?.id ?? null;

  const handleRemove = () => removeFromCart(item.product.id, variantId);
  const handleQtyChange = (qty: number) =>
    updateQuantity(item.product.id, qty, variantId);

  // Always use unitPrice — it's the resolved price (variant or base)
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
      {/* Image */}
      <img
        src={item.product.image ?? "/placeholder-product.jpg"}
        alt={item.product.name}
        className="h-20 w-20 rounded-lg object-cover shrink-0"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-foreground truncate">
          {item.product.name}
        </p>
        {item.variant && (
          <p className="text-sm text-muted-foreground">
            Size: {item.variant.size}
          </p>
        )}
        <p className="text-sm text-primary font-medium">
          ₦{item.unitPrice.toLocaleString()} each
        </p>
      </div>

      {/* Quantity + subtotal */}
      <div className="flex flex-col items-end gap-2">
        <QuantitySelector
          quantity={item.quantity}
          onChange={handleQtyChange}
          max={item.variant?.stock ?? item.product.total_stock ?? 999}
        />
        <p className="font-heading font-semibold text-foreground">
          ₦{lineTotal.toLocaleString()}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CartItemRow;