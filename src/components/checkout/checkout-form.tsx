"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/ui/image";
import { CreditCard, Truck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore, cartTotals } from "@/lib/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice, cn } from "@/lib/utils";

interface CheckoutFormProps {
  initialEmail?: string;
  initialName?: string;
}

export function CheckoutForm({ initialEmail, initialName }: CheckoutFormProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const { subtotal, shipping, total } = cartTotals(items);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      shipping: {
        fullName: String(form.get("fullName") ?? ""),
        line1: String(form.get("line1") ?? ""),
        line2: String(form.get("line2") ?? "") || undefined,
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? ""),
        postalCode: String(form.get("postalCode") ?? ""),
        country: String(form.get("country") ?? ""),
      },
      paymentMethod,
      notes: String(form.get("notes") ?? "") || undefined,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong placing your order.");
      return;
    }

    // Demo mode: nothing is persisted server-side, so stash the full order
    // for the confirmation page to read back out of sessionStorage.
    if (data.order) {
      sessionStorage.setItem(`demo-order-${data.orderNumber}`, JSON.stringify(data.order));
    }

    clear();
    router.push(`/order-success/${data.orderNumber}`);
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-12">
        {error && (
          <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <section>
          <h2 className="mb-5 font-serif text-xl text-foreground">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={initialEmail ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-serif text-xl text-foreground">Shipping Address</h2>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required defaultValue={initialName ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="line1">Address Line 1</Label>
              <Input id="line1" name="line1" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="line2">Address Line 2 (optional)</Label>
              <Input id="line2" name="line2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" required defaultValue="United States" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-5 font-serif text-xl text-foreground">Payment</h2>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as "cod" | "card")}
            className="flex flex-col gap-3"
          >
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 border px-4 py-4",
                paymentMethod === "cod" ? "border-primary" : "border-border",
              )}
            >
              <RadioGroupItem value="cod" />
              <Truck className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">Pay on Delivery</p>
                <p className="text-xs text-muted-foreground">Pay by card or cash when your order arrives.</p>
              </div>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 border px-4 py-4 opacity-60",
                paymentMethod === "card" ? "border-primary" : "border-border",
              )}
            >
              <RadioGroupItem value="card" disabled />
              <CreditCard className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-foreground">Credit / Debit Card</p>
                <p className="text-xs text-muted-foreground">
                  Card payments open soon — connect a Stripe key to enable.
                </p>
              </div>
            </label>
          </RadioGroup>
        </section>

        <section>
          <Label htmlFor="notes">Order Notes (optional)</Label>
          <Textarea id="notes" name="notes" className="mt-2" placeholder="Delivery instructions, gift note…" />
        </section>
      </div>

      <aside className="h-fit border border-border p-6">
        <h2 className="font-serif text-xl text-foreground">Order Summary</h2>
        <ul className="mt-5 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-secondary">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {item.quantity}
                </span>
              </div>
              <div className="flex flex-1 flex-col text-sm">
                <span className="text-foreground">{item.name}</span>
                {item.variantLabel && <span className="text-xs text-muted-foreground">{item.variantLabel}</span>}
              </div>
              <span className="text-sm text-foreground">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <Separator className="my-5" />
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
        </div>
        <Separator className="my-5" />
        <div className="flex justify-between text-base font-medium text-foreground">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
          {loading ? "Placing Order…" : "Place Order"}
        </Button>
      </aside>
    </form>
  );
}
