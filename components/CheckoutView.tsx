"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { productImages } from "@/data/products";
import { site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { LockIcon } from "./Icons";
import { OrderSummary } from "./OrderSummary";

export function CheckoutView() {
  const { lines, ready } = useCart();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: lines.map(({ slug, swatch, size, quantity }) => ({ slug, swatch, size, quantity })),
        }),
      });
      const data = (await res.json()) as { url?: string; message?: string };
      if (res.ok && data.url) {
        window.location.assign(data.url); // off to Stripe's secure payment page
        return;
      }
      setStatus("error");
      setMessage(data.message ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Check your connection and try again.");
    }
  }

  if (!ready) return <div className="container-page py-14 text-muted">Loading checkout…</div>;

  if (lines.length === 0) {
    return (
      <div className="container-page py-14">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-4">Your cart is empty.</p>
        <Link href="/collections/best-sellers" className="btn-primary mt-6">
          Shop best sellers
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <Link href="/cart" className="text-sm text-muted link-underline">
        ← Back to cart
      </Link>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Checkout</h1>

      <form onSubmit={startCheckout} className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-lg font-semibold">
              1. Contact
            </h2>
            <label htmlFor="checkout-email" className="mt-4 block text-sm font-medium">
              Email for your order confirmation
            </label>
            <input
              id="checkout-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-2"
              placeholder="you@example.com"
            />
          </section>

          <section aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="text-lg font-semibold">
              2. Delivery &amp; payment
            </h2>
            <p className="mt-3 flex gap-3 rounded-md bg-sand/70 p-4 text-sm leading-6">
              <LockIcon size={20} className="mt-0.5 shrink-0 text-accent" />
              <span>
                You&apos;ll enter your Canadian shipping address and pay on our secure payment page, powered by Stripe.
                We accept Visa, Mastercard, American Express, Apple Pay and Google Pay. All prices are in{" "}
                {site.currency}.
              </span>
            </p>
          </section>

          <section aria-labelledby="items-heading">
            <h2 id="items-heading" className="text-lg font-semibold">
              3. Your items
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-4 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-sand">
                    <Image src={productImages(l.product)[0]} alt={l.product.name} fill sizes="64px" className="object-cover" />
                    <span className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-ink text-[11px] text-canvas">
                      {l.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{l.product.name}</p>
                    <p className="text-sm text-muted">{[l.swatch, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(l.lineTotal)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary>
            <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
              <LockIcon size={18} />
              {status === "loading" ? "Opening secure payment…" : "Continue to payment"}
            </button>
            {message && (
              <p role="alert" className="mt-4 rounded-md bg-sale-soft p-3 text-sm text-sale">
                {message}
              </p>
            )}
            <p className="mt-3 text-center text-xs text-muted">
              By placing an order you agree to our{" "}
              <Link href="/terms" className="link-underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="link-underline">
                Privacy Policy
              </Link>
              .
            </p>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}
