"use client";

import { useEffect, useState } from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Demo mode: this page is client-rendered and reads the order that
// checkout-form.tsx stashed in sessionStorage right after "placing" it —
// nothing is persisted server-side, so a fresh tab or a cleared session
// won't find it. The live-Supabase version of this page (a Server
// Component querying the `orders` table by order_number) is in git
// history — see src/lib/demo-mode.ts for how to switch back.

interface DemoOrderItem {
  productName: string;
  variantLabel: string | null;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface DemoOrder {
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: DemoOrderItem[];
  shippingName: string;
  shippingAddress: string;
  shippingAddress2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostcode: string;
  shippingCountry: string;
  paymentMethod: "cod" | "card";
  orderStatus: string;
}

export default function OrderSuccessPage() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<DemoOrder | null | undefined>(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem(`demo-order-${params.orderNumber}`);
    setOrder(raw ? (JSON.parse(raw) as DemoOrder) : null);
  }, [params.orderNumber]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <div className="container-wide section-y flex flex-col items-center text-center !pt-16">
        <h1 className="font-serif text-3xl text-foreground">We couldn&apos;t find that order</h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          This demo doesn&apos;t save orders between sessions — try placing a new one from the shop.
        </p>
        <Button size="lg" className="mt-10" asChild>
          <Link href="/shop">Shop Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide section-y flex flex-col items-center !pt-16">
      <CheckCircle2 className="h-12 w-12 text-clay" strokeWidth={1.2} />
      <h1 className="mt-6 font-serif text-3xl text-foreground sm:text-4xl">Thank You for Your Order</h1>
      <p className="mt-3 text-muted-foreground">
        Order <span className="font-medium text-foreground">{order.orderNumber}</span> has been confirmed.
      </p>

      <div className="mt-12 w-full max-w-2xl border border-border p-6 sm:p-8">
        <ul className="flex flex-col gap-5">
          {order.items.map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-secondary">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center text-sm">
                <span className="font-medium text-foreground">{item.productName}</span>
                {item.variantLabel && <span className="text-muted-foreground">{item.variantLabel}</span>}
                <span className="text-muted-foreground">Qty {item.quantity}</span>
              </div>
              <span className="self-center text-sm font-medium text-foreground">
                {formatPrice(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">
              {order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-base font-medium text-foreground">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Delivery Address</p>
            <p className="text-sm text-foreground">{order.shippingName}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress}
              {order.shippingAddress2 ? `, ${order.shippingAddress2}` : ""}
              <br />
              {order.shippingCity}, {order.shippingState} {order.shippingPostcode}
              <br />
              {order.shippingCountry}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Payment</p>
            <p className="text-sm text-foreground capitalize">
              {order.paymentMethod === "cod" ? "Pay on Delivery" : "Card"}
            </p>
            <p className="eyebrow mb-2 mt-4">Status</p>
            <p className="text-sm capitalize text-foreground">{order.orderStatus}</p>
          </div>
        </div>
      </div>

      <Button size="lg" className="mt-10" asChild>
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  );
}
