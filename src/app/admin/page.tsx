import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: orderCount }, { count: productCount }, { data: revenueRows }, { data: lowStock }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total").neq("order_status", "cancelled"),
      supabase
        .from("products")
        .select("id, name, stock_quantity")
        .lte("stock_quantity", 10)
        .order("stock_quantity", { ascending: true })
        .limit(5),
      supabase
        .from("orders")
        .select("id, order_number, order_status, total, order_items(id)")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const revenue = (revenueRows ?? []).reduce((sum, r) => sum + r.total, 0);

  const stats = [
    { label: "Total Orders", value: (orderCount ?? 0).toString() },
    { label: "Revenue", value: formatPrice(revenue) },
    { label: "Products", value: (productCount ?? 0).toString() },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">A snapshot of your store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold">Recent Orders</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {(!recentOrders || recentOrders.length === 0) && (
              <p className="py-4 text-sm text-gray-500">No orders yet.</p>
            )}
            {recentOrders?.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-gray-900"
              >
                <div>
                  <p className="font-medium">{o.order_number}</p>
                  <p className="text-xs text-gray-500">{o.order_items.length} items · {o.order_status}</p>
                </div>
                <span className="font-medium">{formatPrice(o.total)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold">Low Stock</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {(!lowStock || lowStock.length === 0) && (
              <p className="py-4 text-sm text-gray-500">All stocked up.</p>
            )}
            {lowStock?.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center justify-between py-3 text-sm hover:text-gray-900"
              >
                <span>{p.name}</span>
                <span className={p.stock_quantity === 0 ? "font-medium text-red-600" : "text-gray-500"}>
                  {p.stock_quantity} left
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
