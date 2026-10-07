import type { Metadata } from "next";
import { CheckoutView } from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for your Daymark order.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
