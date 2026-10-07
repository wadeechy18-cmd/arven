import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, site.freeShippingThreshold - subtotal);
  const pct = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);
  return (
    <div>
      <p className="text-sm">
        {remaining > 0 ? (
          <>
            You&apos;re <strong>{formatPrice(remaining)}</strong> away from free shipping.
          </>
        ) : (
          <>You&apos;ve unlocked <strong>free shipping</strong> across Canada.</>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand" aria-hidden="true">
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
