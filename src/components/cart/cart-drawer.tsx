"use client";

import Image from "@/components/ui/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, cartTotals } from "@/lib/cart-store";
import { useUIStore } from "@/lib/ui-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

export function CartDrawer() {
  const hydrated = useHydrated();
  const open = useUIStore((s) => s.cartOpen);
  const setOpen = useUIStore((s) => s.setCartOpen);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const { subtotal, shipping, itemCount } = cartTotals(hydrated ? items : []);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>
        </SheetHeader>

        {!hydrated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button onClick={() => setOpen(false)} asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {shipping > 0 && (
              <p className="border border-border bg-secondary/50 px-4 py-2.5 text-xs text-muted-foreground">
                Add {formatPrice(remainingForFreeShipping)} more for free shipping.
              </p>
            )}
            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-col divide-y divide-border">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-secondary">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-sm font-medium text-foreground hover:underline"
                          >
                            {item.name}
                          </Link>
                          {item.variantLabel && (
                            <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.key)}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <Button size="lg" className="mt-2 w-full" asChild onClick={() => setOpen(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button variant="ghost" className="w-full" asChild onClick={() => setOpen(false)}>
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
