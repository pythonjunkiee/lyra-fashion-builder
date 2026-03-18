import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import type { ApiProduct } from "@/lib/api";

const colorFilters = ["Desert Rose", "Midnight Teal", "Champagne", "Soft Blush", "Ocean Blue", "Emerald Green"];
const sizeFilters = ["S", "M", "L", "XL"];
const priceRanges = [
  { label: "Under AED 200", min: 0, max: 200 },
  { label: "AED 200 - 300", min: 200, max: 300 },
  { label: "AED 300 - 400", min: 300, max: 400 },
  { label: "Over AED 400", min: 400, max: 10000 },
];

function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product,
      quantity: 1,
      selectedSize: product.sizes[0] ?? 'One Size',
      selectedColor: product.colors[0] ?? '',
      stitchingAdded: false,
    });
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group lyra-product-card"
    >
      <div className="relative overflow-hidden rounded-xl bg-card mb-4">
        <div className="aspect-[3/4] bg-gradient-to-br from-lyra-sand to-lyra-cream flex items-center justify-center">
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/60 flex items-center justify-center">
                <span className="font-display text-2xl text-primary/40">L</span>
              </div>
              <p className="font-body text-xs text-muted-foreground/60">Product Image</p>
            </div>
          )}
        </div>

        {product.badge && (
          <Badge
            className={`absolute top-3 left-3 font-body text-xs ${
              product.badge === "NEW"
                ? "bg-primary text-primary-foreground"
                : product.badge === "BESTSELLER"
                ? "bg-lyra-gold text-white"
                : product.badge === "LIMITED"
                ? "bg-lyra-rose text-white"
                : "bg-destructive text-destructive-foreground"
            }`}
          >
            {product.badge}
          </Badge>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="w-full bg-primary/90 hover:bg-primary text-primary-foreground font-body"
            onClick={handleQuickAdd}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground line-clamp-1">
          {product.shortDescription}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-primary">
            AED {product.price}
          </span>
          {product.compareAtPrice && (
            <span className="font-body text-sm text-muted-foreground line-through">
              AED {product.compareAtPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {product.colors.slice(0, 3).map((color, i) => (
            <span key={i} className="font-body text-xs text-muted-foreground">
              {color}{i < Math.min(product.colors.length, 3) - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function FilterSidebar({
  selectedColors,
  setSelectedColors,
  selectedSizes,
  setSelectedSizes,
  selectedPriceRange,
  setSelectedPriceRange,
}: {
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  selectedSizes: string[];
  setSelectedSizes: (sizes: string[]) => void;
  selectedPriceRange: number | null;
  setSelectedPriceRange: (index: number | null) => void;
}) {
  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(
      selectedSizes.includes(size)
        ? selectedSizes.filter((s) => s !== size)
        : [...selectedSizes, size]
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-display text-lg font-medium mb-4">Price</h4>
        <div className="space-y-3">
          {priceRanges.map((range, index) => (
            <div key={range.label} className="flex items-center gap-3">
              <Checkbox
                id={`price-${index}`}
                checked={selectedPriceRange === index}
                onCheckedChange={() => setSelectedPriceRange(selectedPriceRange === index ? null : index)}
              />
              <label htmlFor={`price-${index}`} className="font-body text-sm cursor-pointer">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display text-lg font-medium mb-4">Size</h4>
        <div className="flex flex-wrap gap-2">
          {sizeFilters.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-4 py-2 rounded-md font-body text-sm transition-colors ${
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display text-lg font-medium mb-4">Color</h4>
        <div className="space-y-3">
          {colorFilters.map((color) => (
            <div key={color} className="flex items-center gap-3">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <label htmlFor={`color-${color}`} className="font-body text-sm cursor-pointer">
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ShopMukhawar = () => {
  const [sortBy, setSortBy] = useState("featured");
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);

  const { data: allProducts = [], isLoading } = useProducts();

  // Filter — same logic as before, adapted for ApiProduct (price is a string)
  const filteredProducts = allProducts.filter((product) => {
    if (product.category !== "mukhawar" && product.category !== "premium") return false;

    if (selectedColors.length > 0) {
      const hasMatchingColor = product.colors.some((c) =>
        selectedColors.some((sc) => c.toLowerCase().includes(sc.toLowerCase()))
      );
      if (!hasMatchingColor) return false;
    }

    if (selectedSizes.length > 0) {
      const hasMatchingSize = product.sizes.some((s) => selectedSizes.includes(s));
      if (!hasMatchingSize) return false;
    }

    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      const price = parseFloat(product.price);
      if (price < range.min || price > range.max) return false;
    }

    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
        return a.badge === "NEW" ? -1 : 1;
      default:
        return a.featured ? -1 : 1;
    }
  });

  const activeFiltersCount = selectedColors.length + selectedSizes.length + (selectedPriceRange !== null ? 1 : 0);

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPriceRange(null);
  };

  return (
    <Layout>
      <section className="bg-lyra-cream/50 py-12">
        <div className="container">
          <nav className="font-body text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Mukhawar</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Mukhawar Collection
          </h1>
          <p className="font-body text-muted-foreground max-w-2xl">
            Discover our signature Mukhawars, each piece crafted from 100% premium cotton with
            intricate embroidery. From everyday elegance to special occasions, find your perfect fit.
          </p>
        </div>
      </section>

      <section className="border-b border-border sticky top-[104px] bg-background z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden font-body">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="font-display">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      selectedColors={selectedColors}
                      setSelectedColors={setSelectedColors}
                      selectedSizes={selectedSizes}
                      setSelectedSizes={setSelectedSizes}
                      selectedPriceRange={selectedPriceRange}
                      setSelectedPriceRange={setSelectedPriceRange}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <span className="font-body text-sm text-muted-foreground hidden sm:inline">
                {isLoading ? "Loading..." : `${sortedProducts.length} products`}
              </span>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="font-body text-sm">
                  Clear all
                  <X className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center border rounded-md">
                <button
                  onClick={() => setGridView("grid")}
                  className={`p-2 ${gridView === "grid" ? "bg-muted" : ""}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridView("list")}
                  className={`p-2 ${gridView === "list" ? "bg-muted" : ""}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] font-body">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured" className="font-body">Featured</SelectItem>
                  <SelectItem value="newest" className="font-body">Newest</SelectItem>
                  <SelectItem value="price-low" className="font-body">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="font-body">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
              />
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <div className={`grid gap-6 ${gridView === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-display text-xl text-muted-foreground mb-4">
                    No products match your filters
                  </p>
                  <Button onClick={clearFilters} variant="outline" className="font-body">
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  gridView === "grid"
                    ? "sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShopMukhawar;
