// src/api/apiClient.ts
import axios from "axios";
import {
    Product,
    Category,
    OrderFormData,
    OrderPayload,
    Order,
    CartItem,
} from "@/types/product";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// ── Toggle this to false once your Laravel server is running ──────────────────
const USE_MOCK = false;

// ── Lazy mock import (only used when USE_MOCK = true) ─────────────────────────
const getMocks = async () => {
    const { products, categories } = await import("@/data/mockProducts");
    return { products, categories };
};

// ── Products ──────────────────────────────────────────────────────────────────

export const getProducts = async (params?: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    featured?: boolean;
    sort?: string;
    page?: number;
}): Promise<Product[]> => {
    if (USE_MOCK) {
        const { products } = await getMocks();
        return products;
    }
    const { data } = await apiClient.get("/products", { params });
    // Laravel paginates — real response shape is { data: Product[] }
    return data.data;
};

export const getProductById = async (
    id: number
): Promise<{ product: Product; related: Product[] } | undefined> => {
    if (USE_MOCK) {
        const { products } = await getMocks();
        const product = products.find((p) => p.id === id);
        if (!product) return undefined;
        return { product, related: products.slice(0, 4) };
    }
    const { data } = await apiClient.get(`/products/${id}`);
    // Real response: { data: Product, related: Product[] }
    return { product: data.data, related: data.related };
};

// ── Categories ────────────────────────────────────────────────────────────────

export const getCategories = async (): Promise<Category[]> => {
    if (USE_MOCK) {
        const { categories } = await getMocks();
        return categories;
    }
    const { data } = await apiClient.get("/categories");
    return data.data;
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const submitOrder = async (
    form: OrderFormData,
    cartItems: CartItem[]
): Promise<{ success: boolean; orderId?: string }> => {
    if (USE_MOCK) {
        return { success: true, orderId: `ORD-${Date.now()}` };
    }

    const payload: OrderPayload = {
        full_name: form.fullName,
        phone: form.phone,
        delivery_address: form.address,
        notes: form.notes,
        items: cartItems.map((item) => ({
            product_id: item.product.id,
            variant_id: item.variant?.id ?? null,
            quantity: item.quantity,
        })),
    };

    const { data } = await apiClient.post<{ message: string; data: Order }>(
        "/orders",
        payload
    );

    return {
        success: true,
        orderId: data.data.order_number,
    };
};

export const getOrderByNumber = async (
    orderNumber: string
): Promise<Order | undefined> => {
    if (USE_MOCK) return undefined;
    const { data } = await apiClient.get(`/orders/${orderNumber}`);
    return data.data;
};

export default apiClient;