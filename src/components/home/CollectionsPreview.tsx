import { Link } from "react-router-dom";
import { collections } from "@/types/product";

export function CollectionsPreview() {
  return (
    <section className="py-16 md:py-24 bg-lyra-sand/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Our Collections
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Curated collections for every moment and season
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-[4/5] lyra-product-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient based on collection */}
              <div
                className={`absolute inset-0 ${
                  index === 0
                    ? "bg-gradient-to-br from-lyra-cream to-lyra-sand"
                    : index === 1
                    ? "bg-gradient-to-br from-lyra-rose/30 to-lyra-cream"
                    : index === 2
                    ? "bg-gradient-to-br from-lyra-gold/20 to-lyra-cream"
                    : "bg-gradient-to-br from-lyra-teal/10 to-lyra-cream"
                }`}
              />

              {/* Content overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />

              {/* Text content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <span className="font-body text-xs uppercase tracking-wider mb-1 opacity-80">
                  {collection.productCount} Products
                </span>
                <h3 className="font-display text-xl font-medium mb-2 group-hover:translate-x-1 transition-transform">
                  {collection.name}
                </h3>
                <p className="font-body text-sm opacity-80 line-clamp-2">
                  {collection.description}
                </p>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-lg">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
