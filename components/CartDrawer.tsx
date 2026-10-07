"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { CartLineItem } from "./CartLineItem";
import { Drawer } from "./Drawer";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { CloseIcon } from "./Icons";

export function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal } = useCart();

  return (
    <Drawer open={isOpen} onClose={closeCart} side="right" label="Shopping cart">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
        <h2 className="text-lg font-semibold">
          Your cart {count > 0 && <span className="font-normal text-muted">({count})</span>}
        </h2>
        <button type="button" onClick={closeCart} className="-mr-3 grid size-12 place-items-center" aria-label="Close cart">
          <CloseIcon />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="text-sm text-muted">Let&apos;s find something you&apos;ll love.</p>
          <div className="mt-2 flex w-full flex-col gap-3">
            <Link href="/collections/best-sellers" onClick={closeCart} className="btn-primary">
              Shop best sellers
            </Link>
            <Link href="/collections/new-arrivals" onClick={closeCart} className="btn-secondary">
              Shop new arrivals
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-line px-5 py-4">
            <FreeShippingMeter subtotal={subtotal} />
          </div>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} onNavigate={closeCart} />
            ))}
          </ul>
          <div className="border-t border-line px-5 py-5">
            <div className="flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)} CAD</span>
            </div>
            <p className="mt-1 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
            <div className="mt-4 grid gap-3">
              <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
                Checkout
              </Link>
              <Link href="/cart" onClick={closeCart} className="btn-secondary w-full">
                View cart
              </Link>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
