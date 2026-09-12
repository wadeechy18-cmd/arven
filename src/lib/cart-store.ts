import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  key: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  variantLabel?: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.key === item.key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === item.key
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + quantity, i.maxStock || 99),
                  }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
      },
      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      updateQuantity: (key, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock || 99)) } : i,
            )
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "arven-cart" },
  ),
);

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 10000 ? 0 : 800;
  const total = subtotal + shipping;
  return { subtotal, shipping, total, itemCount };
}
