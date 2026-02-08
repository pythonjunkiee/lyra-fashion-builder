import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Minus, Plus, Truck, RotateCcw, Ruler, Scissors, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleProducts } from "@/types/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = sampleProducts.find((p) => p.slug === slug) || sampleProducts[0];

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addStitching, setAddStitching] = useState(false);

  const stitchingPrice = 40;
  const totalPrice = (product.price + (addStitching ? stitchingPrice : 0)) * quantity;

  const relatedProducts = sampleProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="font-body text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop/mukhawar" className="hover:text-primary">Mukhawar</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-lyra-sand to-lyra-cream">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/60 flex items-center justify-center">
                    <span className="font-display text-4xl text-primary/40">L</span>
                  </div>
                  <p className="font-body text-muted-foreground">Product Image</p>
                </div>
              </div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-gradient-to-br from-lyra-sand to-lyra-cream cursor-pointer hover:ring-2 ring-primary transition-all"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badge & Title */}
            <div>
              {product.badge && (
                <Badge
                  className={`mb-3 font-body text-xs ${
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
              <h1 className="font-display text-2xl md:text-3xl font-medium mb-2">
                {product.name}
              </h1>
              <p className="font-body text-muted-foreground">
                {product.shortDescription}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold text-primary">
                AED {product.price}
              </span>
              {product.compareAtPrice && (
                <span className="font-body text-lg text-muted-foreground line-through">
                  AED {product.compareAtPrice}
                </span>
              )}
            </div>

            {/* Fabric & Embroidery */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-border">
              <div>
                <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Fabric</span>
                <p className="font-body font-medium">{product.fabric}</p>
              </div>
              {product.embroideryType && (
                <div>
                  <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Embroidery</span>
                  <p className="font-body font-medium">{product.embroideryType}</p>
                </div>
              )}
            </div>

            {/* Color */}
            <div>
              <span className="font-body text-sm font-medium mb-3 block">
                Color: {product.colors.join(", ")}
              </span>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-full border border-border font-body text-sm"
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-sm font-medium">Size</span>
                <Link to="/size-guide" className="font-body text-sm text-primary hover:underline flex items-center gap-1">
                  <Ruler className="h-4 w-4" />
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-md font-body text-sm transition-colors ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stitch & Style Option */}
            <div
              className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                addStitching
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setAddStitching(!addStitching)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  addStitching ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {addStitching && <Check className="h-4 w-4 text-primary-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-lg font-medium flex items-center gap-2">
                      <Scissors className="h-5 w-5 text-lyra-gold" />
                      Add Stitch & Style
                    </span>
                    <span className="font-body font-semibold text-primary">+AED {stitchingPrice}</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground">
                    Get your Mukhawar professionally stitched to your measurements. Delivered in 2-3 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-body font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 font-body tracking-wide"
                disabled={!selectedSize}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Bag – AED {totalPrice}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Shipping info */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-body text-sm font-medium">Free Shipping</p>
                  <p className="font-body text-xs text-muted-foreground">Orders over AED 300</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-body text-sm font-medium">Easy Returns</p>
                  <p className="font-body text-xs text-muted-foreground">14-day return policy</p>
                </div>
              </div>
            </div>

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger className="font-display text-lg">Description</AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger className="font-display text-lg">Product Details</AccordionTrigger>
                <AccordionContent>
                  <ul className="font-body text-muted-foreground space-y-2">
                    <li>• 100% Premium Cotton for ultimate comfort</li>
                    <li>• Breathable and lightweight fabric</li>
                    <li>• {product.embroideryType || "Intricate embroidery details"}</li>
                    <li>• Modest fit with elegant drape</li>
                    <li>• Machine washable at 30°C</li>
                    <li>• Iron on medium heat</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="font-display text-lg">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  <p className="mb-2">
                    <strong>Shipping:</strong> Free delivery on orders over AED 300. Standard delivery 2-4 business days.
                  </p>
                  <p>
                    <strong>Returns:</strong> We offer 14-day returns on unworn items with tags attached. 
                    Stitched items are final sale.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border">
            <h2 className="font-display text-2xl md:text-3xl font-medium mb-8">
              You May Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="group lyra-product-card"
                >
                  <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-lyra-sand to-lyra-cream mb-4" />
                  <h3 className="font-display text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <span className="font-display text-lg font-semibold text-primary">
                    AED {p.price}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
