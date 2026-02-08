import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container py-12">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl mb-2">
              Join the Lyra Family
            </h3>
            <p className="font-body text-primary-foreground/80 mb-6">
              Subscribe to receive exclusive offers, early access to new collections, and styling inspiration.
            </p>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 font-body"
              />
              <Button className="bg-lyra-gold hover:bg-lyra-gold/90 text-white font-body whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Shop */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Shop</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/80">
              <li><Link to="/shop/mukhawar" className="hover:text-primary-foreground transition-colors">Mukhawar</Link></li>
              <li><Link to="/shop/shaila" className="hover:text-primary-foreground transition-colors">Matching Shaila</Link></li>
              <li><Link to="/shop/kids" className="hover:text-primary-foreground transition-colors">Little Lyra</Link></li>
              <li><Link to="/shop/premium" className="hover:text-primary-foreground transition-colors">Premium Edit</Link></li>
              <li><Link to="/gifts" className="hover:text-primary-foreground transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Collections</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/80">
              <li><Link to="/collections/everyday" className="hover:text-primary-foreground transition-colors">Everyday Essentials</Link></li>
              <li><Link to="/collections/special" className="hover:text-primary-foreground transition-colors">Special Occasions</Link></li>
              <li><Link to="/collections/wedding" className="hover:text-primary-foreground transition-colors">Wedding Season</Link></li>
              <li><Link to="/collections/ramadan" className="hover:text-primary-foreground transition-colors">Ramadan Edit</Link></li>
              <li><Link to="/collections/new" className="hover:text-primary-foreground transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">About Lyra</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/80">
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">Our Story</Link></li>
              <li><Link to="/stitch-style" className="hover:text-primary-foreground transition-colors">Stitch & Style</Link></li>
              <li><Link to="/stores" className="hover:text-primary-foreground transition-colors">Store Locator</Link></li>
              <li><Link to="/sustainability" className="hover:text-primary-foreground transition-colors">Sustainability</Link></li>
              <li><Link to="/careers" className="hover:text-primary-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Customer Care</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/80">
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-foreground transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-primary-foreground transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="hover:text-primary-foreground transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-primary-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-display text-xl font-semibold">LYRA FASHION</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-lyra-gold transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-lyra-gold transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-lyra-gold transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-lyra-gold transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
            <p className="font-body text-sm text-primary-foreground/60">
              © 2024 Lyra Fashion. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-primary-foreground/5">
        <div className="container py-4">
          <div className="flex flex-wrap justify-center gap-4 text-xs font-body text-primary-foreground/60">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
            <Link to="/accessibility" className="hover:text-primary-foreground transition-colors">Accessibility</Link>
            <span>Proudly Made in the UAE 🇦🇪</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
