// src/pages/Products.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import SearchBar from "@/components/product/SearchBar";
import FilterSidebar from "@/components/product/FilterSidebar";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { SlidersHorizontal, X } from "lucide-react";

const Products = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "";

    const [search, setSearch]       = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory]   = useState(initialCategory);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
    const [showFilters, setShowFilters] = useState(false);
    const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>([0, 500000]);

    // Debounce search so we don't fire on every keystroke
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);


    useEffect(() => {
        const t = setTimeout(() => setDebouncedPrice(priceRange), 500);
        return () => clearTimeout(t);
    }, [priceRange]);
    

    const { products, loading, error } = useProducts({
        search: debouncedSearch || undefined,
        category: category || undefined,
        min_price: debouncedPrice[0] > 0 ? debouncedPrice[0] : undefined,      // ← debouncedPrice
        max_price: debouncedPrice[1] < 500000 ? debouncedPrice[1] : undefined,  // ← debouncedPrice
    });

    const { categories } = useCategories();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Eyebrow>The store</Eyebrow>
                <h1 className="mt-2 font-heading text-3xl md:text-4xl font-semibold text-foreground">All Products</h1>
                <p className="mt-1 text-muted-foreground">Browse our complete range of building materials</p>
            </div>

            <div className="mb-6 flex items-center gap-4">
                <div className="flex-1">
                    <SearchBar value={search} onChange={setSearch} />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted lg:hidden"
                >
                    {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                    Filters
                </button>
            </div>

            <div className="flex gap-8">
                {/* Desktop sidebar */}
                <div className="hidden w-56 shrink-0 lg:block">
                    <FilterSidebar
                        categories={categories}
                        selectedCategory={category}
                        onCategoryChange={setCategory}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        maxPrice={500000}
                    />
                </div>

                {/* Mobile filters */}
                {showFilters && (
                    <div className="fixed inset-0 z-40 bg-background p-4 lg:hidden overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-heading text-lg font-semibold">Filters</h2>
                            <button onClick={() => setShowFilters(false)}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <FilterSidebar
                            categories={categories}
                            selectedCategory={category}
                            onCategoryChange={(c) => { setCategory(c); setShowFilters(false); }}
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                            maxPrice={500000}
                        />
                    </div>
                )}

                <div className="flex-1">
                    {/* Loading skeletons */}
                    {loading && (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="py-20 text-center text-destructive">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="py-20 text-center text-muted-foreground">
                            <p className="text-lg">No products found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                            {products.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;