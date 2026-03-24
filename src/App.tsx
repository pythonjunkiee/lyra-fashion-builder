import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ShopMukhawar from "./pages/ShopMukhawar";
import ProductDetail from "./pages/ProductDetail";
import StitchStyle from "./pages/StitchStyle";
import AboutUs from "./pages/AboutUs";
import CheckoutAuth from "./pages/CheckoutAuth";
import CollectionPage from "./pages/CollectionPage";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext";
import { CartDrawer } from "./components/cart/CartDrawer";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop/:category" element={<ShopMukhawar />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/stitch-style" element={<StitchStyle />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/checkout" element={<CheckoutAuth />} />
          <Route path="/collections/:slug" element={<CollectionPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
    </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
