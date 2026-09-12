import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentUser } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = { title: "Your Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  // RLS already scopes this to the signed-in customer's own orders.
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, order_status, total, currency, created_at, order_items(id)")
    .order("created_at", { ascending: false });

  return (
    <div className="container-wide section-y">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <p className="eyebrow mb-2">Account</p>
          <h1 className="font-serif text-3xl text-foreground">
            Welcome, {(user.full_name ?? user.email).split(" ")[0]}
          </h1>
        </div>
        <SignOutButton />
      </div>

      <h2 className="mb-6 font-serif text-xl text-foreground">Order History</h2>
      {!orders || orders.length === 0 ? (
        <div className="border border-dashed border-border py-16 text-center">
          <p className="mb-4 text-muted-foreground">You haven&apos;t placed an order yet.</p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border border border-border">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium text-foreground">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · {order.order_items.length} item{order.order_items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wide",
                    order.order_status === "delivered" && "text-emerald-700",
                    order.order_status === "cancelled" && "text-destructive",
                  )}
                >
                  {order.order_status}
                </span>
                <span className="font-medium text-foreground">
                  {formatPrice(order.total, order.currency)}
                </span>
                <Link
                  href={`/order-success/${order.order_number}`}
                  className="text-sm underline underline-offset-4"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
