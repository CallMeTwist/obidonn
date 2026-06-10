// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { Product, ProductVariant, CartItem } from "@/types/product";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number, variant?: ProductVariant | null) => void;
    removeFromCart: (productId: number, variantId?: number | null) => void;
    updateQuantity: (productId: number, quantity: number, variantId?: number | null) => void;
    clearCart: () => void;
    subtotal: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Unique key per cart line — product alone, or product+variant
    const itemKey = (productId: number, variantId?: number | null) =>
        variantId ? `${productId}-${variantId}` : `${productId}`;

    const addToCart = (
        product: Product,
        quantity: number,
        variant?: ProductVariant | null
    ) => {
        const unitPrice = variant ? variant.price : (product.price ?? product.display_price);
        const key = itemKey(product.id, variant?.id);

        setItems((prev) => {
            const existing = prev.find(
                (i) => itemKey(i.product.id, i.variant?.id) === key
            );
            if (existing) {
                return prev.map((i) =>
                    itemKey(i.product.id, i.variant?.id) === key
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { product, variant: variant ?? null, quantity, unitPrice }];
        });
    };

    const removeFromCart = (productId: number, variantId?: number | null) => {
        const key = itemKey(productId, variantId);
        setItems((prev) =>
            prev.filter((i) => itemKey(i.product.id, i.variant?.id) !== key)
        );
    };

    const updateQuantity = (
        productId: number,
        quantity: number,
        variantId?: number | null
    ) => {
        const key = itemKey(productId, variantId);
        setItems((prev) =>
            prev.map((i) =>
                itemKey(i.product.id, i.variant?.id) === key
                    ? { ...i, quantity }
                    : i
            )
        );
    };

    const clearCart = () => setItems([]);

    const subtotal = items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0
    );

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};