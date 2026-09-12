import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { DEMO_MODE } from "@/lib/demo-mode";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

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

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ARV-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your order details and try again." },
      { status: 400 },
    );
  }

  if (DEMO_MODE) {
    // Nothing is persisted here — prices are still re-derived server-side
    // from the static catalog (never trusted from the request body), and
    // the full order is handed back for the confirmation page to render
    // from sessionStorage. See src/lib/demo-mode.ts to go live for real.
    const { email, phone, shipping, paymentMethod, notes, items } = parsed.data;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = DEMO_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: "One of these items is no longer available." }, { status: 409 });
      }

      const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : undefined;
      const availableStock = variant ? variant.stock : product.stock;
      if (availableStock < item.quantity) {
        return NextResponse.json({ error: `${product.name} is out of stock.` }, { status: 409 });
      }

      const unitPrice = product.price + (variant?.priceDelta ?? 0);
      subtotal += unitPrice * item.quantity;

      orderItems.push({
        productName: product.name,
        variantLabel: variant ? `${variant.name}: ${variant.value}` : null,
        imageUrl: product.images[0]?.url ?? null,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      });
    }

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 800;
    const total = subtotal + shippingCost;
    const orderNumber = generateOrderNumber();

    return NextResponse.json({
      orderNumber,
      order: {
        orderNumber,
        email,
        phone,
        items: orderItems,
        subtotal,
        shippingCost,
        total,
        paymentMethod,
        orderStatus: paymentMethod === "card" ? "paid" : "pending",
        shippingName: shipping.fullName,
        shippingAddress: shipping.line1,
        shippingAddress2: shipping.line2 ?? null,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingPostcode: shipping.postalCode,
        shippingCountry: shipping.country,
        notes: notes ?? null,
      },
    });
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
