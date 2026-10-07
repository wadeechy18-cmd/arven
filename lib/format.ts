import { site } from "@/data/site";

const formatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  currencyDisplay: "narrowSymbol",
});

/** 48 → "$48.00" */
export function formatPrice(amount: number): string {
  return formatter.format(amount);
}

export function shippingFor(subtotal: number): number {
  if (subtotal === 0 || subtotal >= site.freeShippingThreshold) return 0;
  return site.flatShippingRate;
}
