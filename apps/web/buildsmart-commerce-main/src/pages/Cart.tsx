import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/40" />
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some building materials to get started</p>
        <Button asChild className="mt-6">
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-heading text-3xl md:text-4xl font-semibold text-foreground">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.product.id} item={item} />
          ))}
          <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive transition-colors">
            Clear Cart
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 h-fit card-shadow">
          <h3 className="font-heading text-lg font-semibold text-foreground">Order Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-heading font-semibold text-foreground">
              <span>Total</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>
          <Button asChild className="mt-6 w-full btn-gold border-0 font-semibold" size="lg">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
