// src/pages/Checkout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { submitOrder } from "@/api/apiClient";
import { OrderFormData } from "@/types/product";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { waLink } from "@/config/business";

const Checkout = () => {
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [placed, setPlaced] = useState<string | null>(null);
    const [form, setForm] = useState<OrderFormData>({
        fullName: "",
        phone: "",
        address: "",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setLoading(true);
        try {
            // Pass both form data AND cart items — apiClient builds the payload
            const result = await submitOrder(form, items);
            if (result.success) {
                const lines = items
                    .map((it) => `• ${it.product.name}${it.variant ? ` (${it.variant.size})` : ""} ×${it.quantity} — ₦${(it.unitPrice * it.quantity).toLocaleString()}`)
                    .join("\n");
                const message =
                    `Hello DONNS, I'd like to confirm my order *${result.orderId}*.\n\n` +
                    `${lines}\n\n*Total:* ₦${subtotal.toLocaleString()}\n\n` +
                    `Name: ${form.fullName}\nPhone: ${form.phone}\nAddress: ${form.address}` +
                    (form.notes ? `\nNotes: ${form.notes}` : "") +
                    `\n\nI'll send my payment receipt here.`;
                window.open(waLink(message), "_blank", "noopener,noreferrer");
                clearCart();
                setPlaced(result.orderId ?? null);
            }
        } catch (err: any) {
            // Laravel validation errors come back as err.response.data.errors
            const message =
                err?.response?.data?.message ?? "Failed to place order. Try again.";
            toast({ title: "Error", description: message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (placed) {
        return (
            <div className="container mx-auto max-w-xl px-4 py-16 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gold" />
                <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">Order received</h1>
                <p className="mt-3 text-muted-foreground">
                    Your order <span className="font-semibold text-foreground">{placed}</span> is held for 2 days.
                    Finish payment on WhatsApp and send your receipt there — we'll confirm it and your order is locked in.
                </p>
                <a
                    href={waLink(`Hello DONNS, this is about my order ${placed}. I'm sending my payment receipt.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
                >
                    Open WhatsApp
                </a>
                <button onClick={() => navigate("/")} className="mt-4 block w-full text-sm text-muted-foreground hover:text-gold">
                    Back to home
                </button>
            </div>
        );
    }

    if (items.length === 0) {
        navigate("/cart");
        return null;
    }

    const inputClass =
        "w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 font-heading text-3xl md:text-4xl font-semibold text-foreground">
                Checkout
            </h1>

            <div className="grid gap-8 lg:grid-cols-3">
                <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Full Name *
                        </label>
                        <input
                            required
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            className={inputClass}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Phone Number *
                        </label>
                        <input
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className={inputClass}
                            placeholder="+234 801 234 5678"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Delivery Address *
                        </label>
                        <input
                            required
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className={inputClass}
                            placeholder="14 Adeola Odeku Street, Lagos"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            className={`${inputClass} min-h-[100px]`}
                            placeholder="Delivery instructions, gate code, etc."
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2 btn-gold border-0 font-semibold"
                        disabled={loading}
                    >
                        <CheckCircle className="h-4 w-4" />
                        {loading ? "Placing Order..." : "Place Order"}
                    </Button>
                </form>

                {/* Order Summary */}
                <div className="rounded-lg border border-border bg-card p-6 h-fit card-shadow">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                        Order Summary
                    </h3>
                    <div className="mt-4 space-y-3">
                        {items.map((item, index) => (
                            <div
                                key={`${item.product.id}-${item.variant?.id ?? "base"}-${index}`}
                                className="flex justify-between text-sm"
                            >
                <span className="text-muted-foreground">
                  {item.product.name}
                    {item.variant ? ` (${item.variant.size})` : ""} ×{" "}
                    {item.quantity}
                </span>
                                <span className="text-foreground font-medium">
                  ₦{(item.unitPrice * item.quantity).toLocaleString()}
                </span>
                            </div>
                        ))}
                        <div className="border-t border-border pt-3 flex justify-between font-heading font-semibold text-foreground">
                            <span>Total</span>
                            <span>₦{subtotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;