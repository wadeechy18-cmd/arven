"use client";

import Image from "@/components/ui/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, cartTotals } from "@/lib/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const { subtotal, shipping, total, itemCount } = cartTotals(hydrated ? items : []);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (hydrated && items.length === 0) {
    return (
      <div className="container-wide flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
        <h1 className="font-serif text-2xl text-foreground">Your cart is empty</h1>
        <p className="text-muted-foreground">Discover jute bags and leather goods made to last.</p>
        <Button asChild size="lg">
          <Link href="/shop">Shop Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide section-y !pt-10">
      <h1 className="mb-10 font-serif text-3xl text-foreground">
        Your Cart {itemCount > 0 && `(${itemCount})`}
      </h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {(hydrated ? items : []).map((item) => (
            <li key={item.key} className="flex gap-5 py-6">
              <div className="relative h-32 w-28 shrink-0 overflow-hidden bg-secondary">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-medium text-foreground hover:underline">
                      {item.name}
                    </Link>
                    {item.variantLabel && (
                      <p className="mt-1 text-sm text-muted-foreground">{item.variantLabel}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.unitPrice)} each
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.key)}
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="h-4 w-4" /> Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-foreground"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center text-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-medium text-foreground">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border border-border p-6">
          <h2 className="font-serif text-xl text-foreground">Order Summary</h2>
          {shipping > 0 && (
            <p className="mt-4 border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              Add {formatPrice(remaining)} more for free shipping.
            </p>
          )}
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Shipping</span>
              <span className="text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>
          <Separator className="my-5" />
          <div className="flex justify-between text-base font-medium text-foreground">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button size="lg" className="mt-6 w-full" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="ghost" className="mt-2 w-full" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
