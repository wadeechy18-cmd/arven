import type { Metadata } from "next";
import Image from "@/components/ui/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Order Confirmed" };

interface OrderSuccessPageProps {
  params: { orderNumber: string };
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", params.orderNumber)
    .maybeSingle();

  if (!order) notFound();

  return (
    <div className="container-wide section-y flex flex-col items-center !pt-16">
      <CheckCircle2 className="h-12 w-12 text-clay" strokeWidth={1.2} />
      <h1 className="mt-6 font-serif text-3xl text-foreground sm:text-4xl">Thank You for Your Order</h1>
      <p className="mt-3 text-muted-foreground">
        Order <span className="font-medium text-foreground">{order.order_number}</span> has been confirmed.
      </p>

      <div className="mt-12 w-full max-w-2xl border border-border p-6 sm:p-8">
        <ul className="flex flex-col gap-5">
          {order.order_items.map((item: any) => (
            <li key={item.id} className="flex gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-secondary">
                {item.image_url && (
                  <Image src={item.image_url} alt={item.product_name} fill className="object-cover" sizes="64px" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center text-sm">
                <span className="font-medium text-foreground">{item.product_name}</span>
                {item.variant_label && <span className="text-muted-foreground">{item.variant_label}</span>}
                <span className="text-muted-foreground">Qty {item.quantity}</span>
              </div>
              <span className="self-center text-sm font-medium text-foreground">
                {formatPrice(item.total_price)}
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
              {order.shipping_cost === 0 ? "Free" : formatPrice(order.shipping_cost)}
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
            <p className="text-sm text-foreground">{order.shipping_name}</p>
            <p className="text-sm text-muted-foreground">
              {order.shipping_address}
              {order.shipping_address_2 ? `, ${order.shipping_address_2}` : ""}
              <br />
              {order.shipping_city}, {order.shipping_state} {order.shipping_postcode}
              <br />
              {order.shipping_country}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">Payment</p>
            <p className="text-sm text-foreground capitalize">
              {order.payment_method === "cod" ? "Pay on Delivery" : "Card"}
            </p>
            <p className="eyebrow mb-2 mt-4">Status</p>
            <p className="text-sm capitalize text-foreground">{order.order_status}</p>
          </div>
        </div>
      </div>

      <Button size="lg" className="mt-10" asChild>
        <Link href="/shop">Continue Shopping</Link>
      </Button>
    </div>
  );
}
