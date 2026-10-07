"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct, type Product } from "@/data/products";

const STORAGE_KEY = "daymark-cart-v1";
export const MAX_QTY = 10;

export interface CartItem {
  /** Unique per product + variant, e.g. "everyday-organic-tee|Olive|M". */
  id: string;
  slug: string;
  swatch?: string;
  size?: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function itemId(slug: string, swatch?: string, size?: string) {
  return [slug, swatch ?? "", size ?? ""].join("|");
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        typeof i?.id === "string" && typeof i?.slug === "string" && Number.isInteger(i?.quantity) && i.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load the saved cart once, in the browser only.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists after mount
    setItems(readStorage());
    setReady(true);
    // Keep several open tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked (private mode): the cart still works for this visit.
    }
  }, [items, ready]);

  const addItem = useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    const id = itemId(item.slug, item.swatch, item.size);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i));
      }
      return [...prev, { ...item, id, quantity: Math.min(MAX_QTY, quantity) }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i)),
    );
  }, []);

  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    // Prices always come from data/products.ts, never from storage.
    const lines: CartLine[] = items.flatMap((item) => {
      const product = getProduct(item.slug);
      return product ? [{ ...item, product, lineTotal: product.price * item.quantity }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      ready,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    };
  }, [items, ready, isOpen, openCart, closeCart, addItem, updateQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
