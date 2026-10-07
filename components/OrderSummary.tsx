"use client";

import { site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { formatPrice, shippingFor } from "@/lib/format";

export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { subtotal } = useCart();
  const shipping = shippingFor(subtotal);
  return (
    <div className="rounded-md border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping (Canada)</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between text-muted">
          <dt>Taxes (GST/HST/PST)</dt>
          <dd>Calculated at payment</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
          <dt>Estimated total</dt>
          <dd>
            {formatPrice(subtotal + shipping)} {site.currency}
          </dd>
        </div>
      </dl>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
