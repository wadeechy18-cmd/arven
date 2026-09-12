import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-blue-50 text-blue-700",
  processing: "bg-indigo-50 text-indigo-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, email, total, order_status, created_at, order_items(id)")
    .order("created_at", { ascending: false });

  if (searchParams.status) query = query.eq("order_status", searchParams.status);

  const { data: orders } = await query;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Orders</h1>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!searchParams.status ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 text-gray-600"}`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${searchParams.status === s ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 text-gray-600"}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders?.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-gray-900 hover:underline">
                    {o.order_number}
                  </Link>
                </td>
                <td className="px-5 py-3 text-gray-500">{o.email}</td>
                <td className="px-5 py-3 text-gray-500">{o.order_items.length}</td>
                <td className="px-5 py-3">{formatPrice(o.total)}</td>
                <td className="px-5 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[o.order_status as OrderStatus]}`}>
                    {o.order_status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
