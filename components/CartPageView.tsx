"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { CartLineItem } from "./CartLineItem";
import { FreeShippingMeter } from "./FreeShippingMeter";
import { LockIcon } from "./Icons";
import { OrderSummary } from "./OrderSummary";

export function CartPageView() {
  const { lines, ready, count, subtotal } = useCart();

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="text-3xl font-semibold sm:text-4xl">
        Your cart {ready && count > 0 && <span className="text-xl font-normal text-muted">({count})</span>}
      </h1>

      {!ready ? (
        <p className="mt-8 text-muted">Loading your cart…</p>
      ) : lines.length === 0 ? (
        <div className="mt-10 max-w-md">
          <p className="text-lg">Your cart is empty.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/collections/best-sellers" className="btn-primary">
              Shop best sellers
            </Link>
            <Link href="/collections/new-arrivals" className="btn-secondary">
              New arrivals
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <FreeShippingMeter subtotal={subtotal} />
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {lines.map((line) => (
                <CartLineItem key={line.id} line={line} large />
              ))}
            </ul>
            <Link href="/collections/best-sellers" className="mt-6 inline-block text-sm link-underline">
              Continue shopping
            </Link>
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary>
              <Link href="/checkout" className="btn-primary w-full">
                <LockIcon size={18} /> Checkout
              </Link>
              <p className="mt-3 text-center text-xs text-muted">Secure payment. All prices in Canadian dollars.</p>
            </OrderSummary>
          </div>
        </div>
      )}
    </div>
  );
}
