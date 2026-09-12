import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const orderSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  shipping: z.object({
    fullName: z.string().min(1).max(120),
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
  }),
  paymentMethod: z.enum(["card", "cod"]),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your order details and try again." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // create_order() is a SECURITY DEFINER Postgres function: it re-fetches
  // every price from `products`/`product_variants` and locks + checks stock
  // itself, so nothing about pricing or availability is trusted from this
  // request body. See supabase/migrations/0001_init.sql.
  const { data, error } = await supabase.rpc("create_order", { payload: parsed.data });

  if (error) {
    const isStockOrAvailability = error.code === "P0001" || error.code === "P0002";
    return NextResponse.json(
      { error: isStockOrAvailability ? error.message : "Unable to place your order. Please try again." },
      { status: isStockOrAvailability ? 409 : 400 },
    );
  }

  return NextResponse.json({ orderNumber: data.orderNumber });
}
