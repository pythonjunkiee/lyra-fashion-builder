import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import type { ApiProduct } from "@/lib/api";

export function BestSellers() {
  const { data: products, isLoading } = useProducts({ featured: true });
  const { addItem } = useCart();
  const featuredProducts = products?.slice(0, 4) ?? [];

  const handleQuickAdd = (e: React.MouseEvent, product: ApiProduct) => {
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
    <section className="py-16 md:py-24 bg-lyra-cream/50">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-2">
              Best Sellers
            </h2>
            <p className="font-body text-muted-foreground">
              Our most loved pieces, chosen by you
            </p>
          </div>
          <Link
            to="/shop/mukhawar"
            className="font-body text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : featuredProducts.map((product: ApiProduct, index: number) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group lyra-product-card"
              style={{ animationDelay: `${index * 100}ms` }}
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

                {/* Badge */}
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

                {/* Quick actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick add button */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    className="w-full bg-primary/90 hover:bg-primary text-primary-foreground font-body"
                    onClick={(e) => handleQuickAdd(e, product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Quick Add
                  </Button>
                </div>
              </div>

              {/* Product info */}
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
                {/* Color options */}
                <div className="flex items-center gap-1">
                  {product.colors.slice(0, 3).map((color, i) => (
                    <span
                      key={i}
                      className="font-body text-xs text-muted-foreground"
                    >
                      {color}{i < Math.min(product.colors.length, 3) - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
