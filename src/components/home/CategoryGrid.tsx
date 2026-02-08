import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "For Everyday Elegance",
    description: "Comfortable Mukhawars for daily wear",
    image: "/placeholder.svg",
    href: "/collections/everyday",
    color: "from-lyra-sand to-lyra-cream",
  },
  {
    title: "For Special Occasions",
    description: "Statement pieces that celebrate",
    image: "/placeholder.svg",
    href: "/collections/special",
    color: "from-lyra-rose/30 to-lyra-cream",
  },
  {
    title: "For Your Little Ones",
    description: "Little Lyra collection for kids",
    image: "/placeholder.svg",
    href: "/shop/kids",
    color: "from-lyra-gold/20 to-lyra-cream",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Shop by Occasion
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            From everyday comfort to special celebrations, find the perfect Mukhawar for every moment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              to={category.href}
              className="group relative overflow-hidden rounded-xl lyra-product-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`aspect-[4/5] bg-gradient-to-br ${category.color}`}>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-display text-2xl font-medium mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center text-sm font-body font-medium text-primary">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                {/* Placeholder for image */}
                <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
                  <span className="font-display text-2xl text-primary/40">L</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
