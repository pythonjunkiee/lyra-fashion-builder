import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/useSearch";
import { useCart } from "@/context/CartContext";

const shopCategories = [
  { name: "Mukhawar", href: "/shop/mukhawar", description: "Premium cotton Mukhawars for every occasion" },
  { name: "Matching Shaila", href: "/shop/shaila", description: "Elegant shailas to complete your look" },
  { name: "Little Lyra", href: "/shop/kids", description: "Beautiful pieces for little ones" },
  { name: "Premium Edit", href: "/shop/premium", description: "Handcrafted limited editions" },
];

const collections = [
  { name: "Everyday Essentials", href: "/collections/everyday" },
  { name: "Special Occasions", href: "/collections/special" },
  { name: "Wedding Season", href: "/collections/wedding" },
  { name: "Ramadan Edit", href: "/collections/ramadan" },
];

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: results = [], isLoading } = useSearch(debouncedQuery);

  // Debounce: wait 300ms after user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setDebouncedQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search products</DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Mukhawars, Shailas, fabrics..."
            className="flex-1 bg-transparent font-body text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading && (
            <div className="px-4 py-6 text-center font-body text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && (
            <div className="px-4 py-6 text-center font-body text-sm text-muted-foreground">
              No products found for "{debouncedQuery}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="py-2">
              {results.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => handleSelect(product.slug)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-accent transition-colors text-left"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-lyra-sand to-lyra-cream flex-shrink-0 flex items-center justify-center">
                      <span className="font-display text-primary/40 text-sm">L</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-medium line-clamp-1">{product.name}</p>
                      <p className="font-body text-xs text-muted-foreground line-clamp-1">
                        {product.shortDescription}
                      </p>
                    </div>
                    <span className="font-display text-sm font-semibold text-primary flex-shrink-0">
                      AED {product.price}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!query && (
            <div className="px-4 py-6 text-center font-body text-sm text-muted-foreground">
              Start typing to search products
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-9 items-center justify-center text-sm font-body">
          <span>Free Shipping on Orders Over AED 300 | Proudly Made in the UAE</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu trigger */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="font-display text-xl">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col space-y-4">
              <Link to="/shop/mukhawar" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Shop Mukhawar</Link>
              <Link to="/shop/shaila" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Matching Shaila</Link>
              <Link to="/shop/kids" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Little Lyra</Link>
              <Link to="/shop/premium" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Premium Edit</Link>
              <div className="lyra-divider my-4" />
              <Link to="/collections" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
              <Link to="/stitch-style" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Stitch & Style</Link>
              <Link to="/about" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>About Lyra</Link>
              <Link to="/stores" className="font-display text-lg hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Store Locator</Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-primary">LYRA</span>
          <span className="font-display text-sm font-light text-muted-foreground hidden sm:inline-block">FASHION</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-body">Shop</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {shopCategories.map((category) => (
                    <li key={category.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={category.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="font-display text-sm font-medium leading-none">{category.name}</div>
                          <p className="font-body line-clamp-2 text-sm leading-snug text-muted-foreground">{category.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-body">Collections</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4">
                  {collections.map((collection) => (
                    <li key={collection.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={collection.href}
                          className="block select-none rounded-md p-2 text-sm font-body leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {collection.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/stitch-style" className="font-body px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                Stitch & Style
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/about" className="font-body px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                About
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side icons */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-lyra-gold text-[10px] font-bold text-white flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search dialog */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
