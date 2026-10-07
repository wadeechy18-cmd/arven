import type { Metadata } from "next";
import { CartPageView } from "@/components/CartPageView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your Daymark cart.",
  robots: { index: false },
};

export default function CartPage() {
  return <CartPageView />;
}
