import { X, Minus, Plus, Trash2, ShoppingBag, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart, STITCHING_PRICE } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const { state, closeCart, removeItem, updateQty, toggleStitching, subtotal, itemCount } = useCart();

  if (!state.isOpen) return null;

  const freeShippingThreshold = 300;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-medium">
              Your Bag
              {itemCount > 0 && (
                <span className="ml-2 text-sm text-muted-foreground font-body">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
              )}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Free shipping progress */}
        {subtotal > 0 && remainingForFreeShipping > 0 && (
          <div className="px-6 py-3 bg-lyra-cream/50 border-b border-border">
            <p className="font-body text-xs text-muted-foreground mb-1.5">
              Add <span className="font-semibold text-foreground">AED {remainingForFreeShipping.toFixed(0)}</span> more for free shipping
            </p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}
        {subtotal >= freeShippingThreshold && subtotal > 0 && (
          <div className="px-6 py-2 bg-green-50 border-b border-border">
            <p className="font-body text-xs text-green-700 font-medium">🎉 You qualify for free shipping!</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              <p className="font-display text-lg text-muted-foreground">Your bag is empty</p>
              <p className="font-body text-sm text-muted-foreground">Add some beautiful pieces to get started</p>
              <Button variant="outline" className="font-body mt-2" onClick={closeCart} asChild>
                <Link to="/shop/mukhawar">Browse Collection</Link>
              </Button>
            </div>
          ) : (
            state.items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4">
                {/* Product image */}
                <Link
                  to={`/product/${item.product.slug}`}
                  onClick={closeCart}
                  className="flex-shrink-0 w-20 h-24 rounded-lg bg-gradient-to-br from-lyra-sand to-lyra-cream flex items-center justify-center"
                >
                  <span className="font-display text-xl text-primary/30">L</span>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-display text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedSize)}
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="font-body text-xs text-muted-foreground mt-1 space-y-0.5">
                    <p>Size: <span className="text-foreground">{item.selectedSize}</span></p>
                    {item.selectedColor && (
                      <p>Color: <span className="text-foreground">{item.selectedColor}</span></p>
                    )}
                  </div>

                  {/* Stitching toggle */}
                  <button
                    onClick={() => toggleStitching(item.product.id, item.selectedSize)}
                    className={`mt-2 flex items-center gap-1.5 font-body text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      item.stitchingAdded
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <Scissors className="h-3 w-3" />
                    {item.stitchingAdded ? `Stitching added (+AED ${STITCHING_PRICE})` : 'Add stitching +AED 40'}
                  </button>

                  {/* Price + qty controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => updateQty(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 font-body text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="p-1.5 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-display text-sm font-semibold text-primary">
                      AED {((parseFloat(item.product.price) + (item.stitchingAdded ? STITCHING_PRICE : 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-body text-sm text-muted-foreground">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className={subtotal >= freeShippingThreshold ? 'text-green-600 font-medium' : ''}>
                  {subtotal >= freeShippingThreshold ? 'FREE' : 'AED 25.00'}
                </span>
              </div>
              <div className="flex justify-between font-display text-base font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">
                  AED {(subtotal + (subtotal >= freeShippingThreshold ? 0 : 25)).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 font-body tracking-wide"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full font-body"
              onClick={closeCart}
              asChild
            >
              <Link to="/shop/mukhawar">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
