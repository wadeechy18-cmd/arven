"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateOrderStatus } from "@/lib/admin-actions";
import type { OrderStatus } from "@/lib/supabase/types";

const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        startTransition(async () => {
          await updateOrderStatus(orderId, e.target.value as OrderStatus);
          router.refresh();
        });
      }}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm capitalize focus:border-gray-900 focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="capitalize">
          {s}
        </option>
      ))}
    </select>
  );
}
