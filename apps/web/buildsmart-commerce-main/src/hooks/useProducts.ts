import { useState, useEffect } from "react";
import { getProducts, getCategories } from "@/api/apiClient";
import { Product, Category } from "@/types/product";
import { getProductById } from "@/api/apiClient";

export const useProducts = (params?: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    featured?: boolean;
}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        getProducts(params)
            .then((data) => { if (!cancelled) setProducts(data); })
            .catch((e) => { if (!cancelled) setError(e.message); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        params?.search,
        params?.category,
        params?.min_price,
        params?.max_price,
        params?.featured,
    ]);

    return { products, loading, error };
};

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .finally(() => setLoading(false));
    }, []);

    return { categories, loading };
};

export const useProductDetail = (id: number) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getProductById(id)
            .then((res) => {
                if (res) {
                    setProduct(res.product);
                    setRelated(res.related);
                } else {
                    setError("Product not found.");
                }
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    return { product, related, loading, error };
};