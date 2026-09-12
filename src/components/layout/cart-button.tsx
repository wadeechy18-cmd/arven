"use client";

import { ShoppingBag } from "lucide-react";

import { useCartStore } from "@/lib/cart-store";
import { useUIStore } from "@/lib/ui-store";
import { useHydrated } from "@/hooks/use-hydrated";

export function CartButton() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const count = hydrated ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <button
      type="button"
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      onClick={() => setCartOpen(true)}
      className="relative flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-clay"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
