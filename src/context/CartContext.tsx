import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { ApiProduct } from '@/lib/api';

export interface CartItem {
  product: ApiProduct;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  stitchingAdded: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: number; size: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: number; size: string; qty: number } }
  | { type: 'TOGGLE_STITCHING'; payload: { productId: number; size: string } }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' };

const STORAGE_KEY = 'lyra_cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, selectedSize, selectedColor, stitchingAdded } = action.payload;
      const existing = state.items.findIndex(
        (i) => i.product.id === product.id && i.selectedSize === selectedSize,
      );
      if (existing >= 0) {
        // Increment qty if same product + size already in cart
        const items = state.items.map((item, idx) =>
          idx === existing ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        );
        return { ...state, items, isOpen: true };
      }
      return {
        ...state,
        items: [...state.items, { product, quantity: action.payload.quantity, selectedSize, selectedColor, stitchingAdded }],
        isOpen: true,
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.product.id === action.payload.productId && i.selectedSize === action.payload.size),
        ),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.product.id === action.payload.productId && i.selectedSize === action.payload.size
              ? { ...i, quantity: action.payload.qty }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case 'TOGGLE_STITCHING':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.productId && i.selectedSize === action.payload.size
            ? { ...i, stitchingAdded: !i.stitchingAdded }
            : i,
        ),
      };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, size: string) => void;
  updateQty: (productId: number, size: string, qty: number) => void;
  toggleStitching: (productId: number, size: string) => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STITCHING_PRICE = 40;

function loadFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...JSON.parse(raw), isOpen: false };
  } catch {
    // ignore
  }
  return { items: [], isOpen: false };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  // Persist items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
  }, [state.items]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = state.items.reduce((sum, i) => {
    const base = parseFloat(i.product.price) * i.quantity;
    const stitching = i.stitchingAdded ? STITCHING_PRICE * i.quantity : 0;
    return sum + base + stitching;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (productId, size) => dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } }),
        updateQty: (productId, size, qty) => dispatch({ type: 'UPDATE_QTY', payload: { productId, size, qty } }),
        toggleStitching: (productId, size) => dispatch({ type: 'TOGGLE_STITCHING', payload: { productId, size } }),
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export { STITCHING_PRICE };
