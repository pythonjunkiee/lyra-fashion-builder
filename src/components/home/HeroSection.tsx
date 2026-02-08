import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-lyra-cream via-background to-lyra-sand">
      <div className="container relative z-10 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-body font-medium tracking-wide text-primary bg-primary/10 rounded-full">
              Premium Cotton Mukhawars
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
              Defined by Tradition.
              <br />
              <span className="font-medium text-primary">Designed for Today.</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Discover the art of modest elegance with our handcrafted Mukhawars. 
              100% premium cotton, proudly made in the UAE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-body tracking-wide"
                asChild
              >
                <Link to="/shop/mukhawar">
                  Shop Mukhawar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 font-body tracking-wide"
                asChild
              >
                <Link to="/stitch-style">
                  Stitch & Style Service
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm font-body text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-lyra-gold">✦</span>
                  <span>100% Premium Cotton</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lyra-gold">✦</span>
                  <span>Made in UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lyra-gold">✦</span>
                  <span>Free Shipping 300+ AED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative animate-fade-in">
            <div className="aspect-[3/4] max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden lyra-shadow-elegant bg-gradient-to-br from-lyra-rose/20 via-lyra-cream to-lyra-gold/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-lyra-gold/20 flex items-center justify-center">
                    <span className="font-display text-4xl text-lyra-gold">L</span>
                  </div>
                  <p className="font-display text-lg text-muted-foreground">Hero Image</p>
                  <p className="font-body text-sm text-muted-foreground/60 mt-1">Featured Mukhawar</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-lyra-gold/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-lyra-rose/10 blur-2xl" />
          </div>
        </div>
      </div>

      {/* Background decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-primary" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-primary" />
      </div>
    </section>
  );
}
