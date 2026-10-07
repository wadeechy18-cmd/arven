"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Empties the cart once (used on the order confirmation page). */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
