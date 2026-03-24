import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Heart, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
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

// Each collection maps to the product categories it contains
const collectionMeta: Record<
  string,
  { title: string; description: string; categories: string[] }
> = {
  everyday: {
    title: "Everyday Essentials",
    description:
      "Comfortable, refined pieces designed for your daily wear — from morning routines to afternoon errands and everything in between.",
    categories: ["mukhawar", "shaila"],
  },
  special: {
    title: "Special Occasions",
    description:
      "Elevated pieces for celebrations, gatherings, and the moments that matter most.",
    categories: ["mukhawar", "premium"],
  },
  wedding: {
    title: "Wedding Season",
    description:
      "Bridal-inspired elegance crafted from our finest fabrics — made to make you unforgettable.",
    categories: ["shaila", "premium"],
  },
  ramadan: {
    title: "Ramadan Edit",
    description:
      "Modest, beautiful pieces curated for the holy month — graceful from Iftar to Suhoor.",
    categories: ["mukhawar", "kids", "shaila"],
  },
};

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
      selectedSize: product.sizes[0] ?? "One Size",
      selectedColor: product.colors[0] ?? "",
      stitchingAdded: false,
    });
  };

  return (
    <Link to={`/product/${product.slug}`} className="group lyra-product-card">
      <div className="relative overflow-hidden rounded-xl bg-card mb-4">
        <div className="aspect-[3/4] bg-gradient-to-br from-lyra-sand to-lyra-cream flex items-center justify-center">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
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
      </div>
    </Link>
  );
}

export default function CollectionPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const meta = collectionMeta[slug];

  const [sortBy, setSortBy] = useState("featured");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);

  const { data: allProducts = [], isLoading } = useProducts();

  // Redirect unknown slugs to home
  if (!meta) return <Navigate to="/" replace />;

  const filteredProducts = allProducts.filter((p) => {
    if (!meta.categories.includes(p.category)) return false;
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      const price = parseFloat(p.price);
      if (price < range.min || price > range.max) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return parseFloat(a.price) - parseFloat(b.price);
      case "price-high": return parseFloat(b.price) - parseFloat(a.price);
      case "newest": return a.badge === "NEW" ? -1 : 1;
      default: return a.featured ? -1 : 1;
    }
  });

  const clearFilters = () => setSelectedPriceRange(null);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-lyra-cream/50 py-12">
        <div className="container">
          <nav className="font-body text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/collections/everyday" className="hover:text-primary">Collections</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{meta.title}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-medium mb-4">{meta.title}</h1>
          <p className="font-body text-muted-foreground max-w-2xl">{meta.description}</p>

          {/* Category links within this collection */}
          <div className="flex flex-wrap gap-2 mt-6">
            {meta.categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop/${cat}`}
                className="font-body text-sm px-4 py-1.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors capitalize"
              >
                {cat === "kids" ? "Little Lyra" : cat === "shaila" ? "Matching Shaila" : cat === "premium" ? "Premium Edit" : "Mukhawar"}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="border-b border-border sticky top-[104px] bg-background z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="font-body">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {selectedPriceRange !== null && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">1</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle className="font-display">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className="font-display text-base font-medium mb-3">Price</h4>
                      <div className="space-y-3">
                        {priceRanges.map((range, index) => (
                          <div key={range.label} className="flex items-center gap-3">
                            <Checkbox
                              id={`price-${index}`}
                              checked={selectedPriceRange === index}
                              onCheckedChange={() =>
                                setSelectedPriceRange(selectedPriceRange === index ? null : index)
                              }
                            />
                            <label htmlFor={`price-${index}`} className="font-body text-sm cursor-pointer">
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <span className="font-body text-sm text-muted-foreground hidden sm:inline">
                {isLoading ? "Loading..." : `${sortedProducts.length} products`}
              </span>

              {selectedPriceRange !== null && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="font-body text-sm">
                  Clear filters <X className="ml-1 h-3 w-3" />
                </Button>
              )}
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
      </section>

      {/* Product grid */}
      <section className="py-8">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
