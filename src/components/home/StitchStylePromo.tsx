import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scissors, Truck, Ruler } from "lucide-react";

export function StitchStylePromo() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-body font-medium tracking-wide bg-lyra-gold text-white rounded-full">
              Premium Service
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light mb-6">
              Stitch & Style
              <br />
              <span className="font-medium">Perfect Fit, Delivered</span>
            </h2>
            <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-lg mx-auto lg:mx-0">
              Send us your measurements and we'll stitch your Mukhawar to perfection. 
              Delivered to your door in just 2-3 days.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-3">
                  <Ruler className="h-5 w-5" />
                </div>
                <h4 className="font-body font-medium mb-1">Custom Fit</h4>
                <p className="font-body text-sm text-primary-foreground/60">Your exact measurements</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-3">
                  <Scissors className="h-5 w-5" />
                </div>
                <h4 className="font-body font-medium mb-1">Expert Tailoring</h4>
                <p className="font-body text-sm text-primary-foreground/60">Skilled artisan finish</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-3">
                  <Truck className="h-5 w-5" />
                </div>
                <h4 className="font-body font-medium mb-1">Fast Delivery</h4>
                <p className="font-body text-sm text-primary-foreground/60">Ready in 2-3 days</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-lyra-gold hover:bg-lyra-gold/90 text-white font-body tracking-wide"
                asChild
              >
                <Link to="/stitch-style">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center justify-center lg:justify-start gap-2 font-body">
                <span className="text-2xl font-display font-semibold">AED 40</span>
                <span className="text-sm text-primary-foreground/60">flat rate</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto rounded-2xl bg-primary-foreground/5 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-lyra-gold/20 flex items-center justify-center">
                  <Scissors className="h-10 w-10 text-lyra-gold" />
                </div>
                <p className="font-display text-xl text-primary-foreground/60">Stitch & Style</p>
                <p className="font-body text-sm text-primary-foreground/40 mt-1">Service Illustration</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-2 border-lyra-gold/30" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-lyra-gold/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
