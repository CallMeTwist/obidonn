// src/types/product.ts

export type ProductVariant = {
    id: number;
    size: string;
    price: number;
    stock: number;
    in_stock: boolean;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
     product_count?: number;
};

export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    category: Category;       // was a plain string — now a full object
    category_id: number;

    // Pricing — always use display_price in your UI, never price directly
    has_variants: boolean;
    price: number | null;         // null when has_variants is true
    display_price: number;        // always set — use this everywhere
    stock: number | null;         // null when has_variants is true
    total_stock: number;          // always set — use this for stock checks
    in_stock: boolean;

    variants: ProductVariant[];   // empty array when has_variants is false

    is_featured: boolean;
    is_active: boolean;
};

// What lives in the cart
export type CartItem = {
    product: Product;
    variant: ProductVariant | null;  // null for products without variants
    quantity: number;
    unitPrice: number;               // resolved price (variant.price OR product.price)
};

export type OrderFormData = {
    fullName: string;
    phone: string;
    address: string;
    notes?: string;
};

// Shape sent to POST /api/orders
export type OrderPayload = {
    full_name: string;
    phone: string;
    delivery_address: string;
    notes?: string;
    items: Array<{
        product_id: number;
        variant_id: number | null;
        quantity: number;
    }>;
};

export type OrderItem = {
    id: number;
    product_name: string;
    variant_size: string | null;
    quantity: number;
    unit_price: number;
    subtotal: number;
};

export type Order = {
    id: number;
    order_number: string;
    full_name: string;
    phone: string;
    delivery_address: string;
    notes: string | null;
    subtotal: number;
    total: number;
    status: string;
    status_label: string;
    items: OrderItem[];
};