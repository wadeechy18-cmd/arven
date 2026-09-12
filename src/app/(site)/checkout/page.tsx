import type { Metadata } from "next";

import { getCurrentUser } from "@/lib/session";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <div className="container-wide section-y !pt-10">
      <h1 className="mb-10 font-serif text-3xl text-foreground">Checkout</h1>
      <CheckoutForm initialEmail={user?.email} initialName={user?.full_name ?? undefined} />
    </div>
  );
}
