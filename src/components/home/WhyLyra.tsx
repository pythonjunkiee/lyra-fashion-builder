import { Leaf, Award, Heart, MapPin } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Premium Cotton",
    description: "Breathable, soft, and gentle on skin. Our fabrics are sourced from the finest cotton.",
  },
  {
    icon: Award,
    title: "Handcrafted Excellence",
    description: "Every piece features intricate embroidery by skilled artisans honoring tradition.",
  },
  {
    icon: Heart,
    title: "Modest & Modern",
    description: "Designs that celebrate cultural heritage while embracing contemporary elegance.",
  },
  {
    icon: MapPin,
    title: "Proudly UAE",
    description: "Made with love in the UAE, supporting local craftsmanship and communities.",
  },
];

export function WhyLyra() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Why Choose Lyra Fashion?
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            We're more than a brand. We're a celebration of tradition, quality, and the art of modest fashion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-lyra-gold/10 flex items-center justify-center group-hover:bg-lyra-gold/20 transition-colors">
                <feature.icon className="h-7 w-7 text-lyra-gold" />
              </div>
              <h3 className="font-display text-lg font-medium mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <span className="font-display text-3xl md:text-4xl font-semibold text-primary">10K+</span>
              <p className="font-body text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <span className="font-display text-3xl md:text-4xl font-semibold text-primary">15+</span>
              <p className="font-body text-sm text-muted-foreground">Branches in UAE</p>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <span className="font-display text-3xl md:text-4xl font-semibold text-primary">4.9★</span>
              <p className="font-body text-sm text-muted-foreground">Customer Rating</p>
            </div>
            <div className="h-12 w-px bg-border hidden md:block" />
            <div className="text-center">
              <span className="font-display text-3xl md:text-4xl font-semibold text-primary">100%</span>
              <p className="font-body text-sm text-muted-foreground">Cotton Quality</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
