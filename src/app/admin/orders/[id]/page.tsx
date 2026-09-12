import Image from "@/components/ui/image";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*), customer:profiles(full_name)")
    .eq("id", params.id)
    .maybeSingle();

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{order.order_number}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.order_status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold">Items</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 py-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-gray-100">
                  {item.image_url && (
                    <Image src={item.image_url} alt="" fill className="object-cover" sizes="48px" />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-900">{item.product_name}</p>
                  {item.variant_label && <p className="text-gray-500">{item.variant_label}</p>}
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.total_price)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-1 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{order.shipping_cost === 0 ? "Free" : formatPrice(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold">Customer</h2>
            <p className="text-sm text-gray-900">{order.email}</p>
            <p className="text-sm text-gray-500">{order.phone}</p>
            {order.customer && (
              <p className="mt-1 text-xs text-gray-400">Registered account: {order.customer.full_name}</p>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold">Shipping Address</h2>
            <p className="text-sm text-gray-900">{order.shipping_name}</p>
            <p className="text-sm text-gray-500">
              {order.shipping_address}
              {order.shipping_address_2 ? `, ${order.shipping_address_2}` : ""}
              <br />
              {order.shipping_city}, {order.shipping_state} {order.shipping_postcode}
              <br />
              {order.shipping_country}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-3 text-sm font-semibold">Payment</h2>
            <p className="text-sm text-gray-900 capitalize">
              {order.payment_method === "cod" ? "Pay on Delivery" : "Card"} · {order.payment_status}
            </p>
            {order.notes && (
              <>
                <h2 className="mb-1 mt-4 text-sm font-semibold">Notes</h2>
                <p className="text-sm text-gray-500">{order.notes}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
