import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ShopMukhawar from "./pages/ShopMukhawar";
import ProductDetail from "./pages/ProductDetail";
import StitchStyle from "./pages/StitchStyle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop/mukhawar" element={<ShopMukhawar />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/stitch-style" element={<StitchStyle />} />
          {/* Placeholder routes */}
          <Route path="/shop/shaila" element={<ShopMukhawar />} />
          <Route path="/shop/kids" element={<ShopMukhawar />} />
          <Route path="/shop/premium" element={<ShopMukhawar />} />
          <Route path="/collections/:slug" element={<ShopMukhawar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
