import { Category } from "@/types/product";

interface Props {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  maxPrice?: number;
}

const FilterSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice = 500000,
}: Props) => {
  return (
    <div className="space-y-6">

      {/* Categories */}
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
          Category
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onCategoryChange("")}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !selectedCategory
                  ? "bg-gold text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onCategoryChange(cat.slug)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-gold text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat.name}</span>
                {cat.product_count !== undefined && (
                  <span className="ml-1 text-xs opacity-60">
                    ({cat.product_count})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
          Price Range
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={1000}
            value={priceRange[1]}
            onChange={(e) =>
              onPriceChange([priceRange[0], Number(e.target.value)])
            }
            className="w-full accent-[hsl(var(--gold))]"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₦0</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FilterSidebar;