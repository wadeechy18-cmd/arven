/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CHECKOUT → STRIPE CHECKOUT (CAD)
 *
 *  TODO(stripe): Payments are OFF until STRIPE_SECRET_KEY is set. To switch on:
 *   1. Create a Stripe account at https://dashboard.stripe.com/register
 *      (business country: Canada, so payouts are in CAD).
 *   2. Developers → API keys → copy the *Secret key* (starts with sk_test_ for
 *      testing, sk_live_ for real payments).
 *   3. Add it as an environment variable named STRIPE_SECRET_KEY:
 *        • locally: in a file called .env.local (see .env.example)
 *        • on Vercel: Project → Settings → Environment Variables, then redeploy.
 *   4. Test with card 4242 4242 4242 4242, any future date, any CVC.
 *   5. Optional: turn on Stripe Tax (Settings → Tax) and set AUTOMATIC_TAX = true
 *      below so GST/HST/PST is added automatically.
 *   6. Optional (recommended before launch): add a webhook for
 *      "checkout.session.completed" to send order emails or update inventory.
 *
 *  Prices are always looked up from data/products.ts on the server, so a
 *  shopper can't change what they pay by editing their browser.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { getProduct } from "@/data/products";
import { site } from "@/data/site";
import { shippingFor } from "@/lib/format";

const AUTOMATIC_TAX = false;

interface IncomingItem {
  slug: string;
  swatch?: string;
  size?: string;
  quantity: number;
}

const toCents = (dollars: number) => Math.round(dollars * 100);

export async function POST(request: Request) {
  let body: { items?: IncomingItem[]; email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  // Validate every line against the catalogue.
  const lines = (body.items ?? []).flatMap((item) => {
    const product = getProduct(String(item.slug));
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !(quantity >= 1 && quantity <= 10)) return [];
    const swatch = product.swatches?.some((s) => s.name === item.swatch) ? item.swatch : undefined;
    const size = product.sizes?.includes(String(item.size)) ? item.size : undefined;
    return [{ product, quantity, swatch, size }];
  });
  if (lines.length === 0) {
    return Response.json({ message: "Your cart is empty." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return Response.json(
      {
        message: `Online payment isn't switched on yet. To place an order, email us at ${site.email} and we'll take care of it.`,
        notConfigured: true,
      },
      { status: 501 },
    );
  }

  const origin = new URL(request.url).origin;
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.quantity, 0);
  const shipping = shippingFor(subtotal);

  // Stripe's API takes form-encoded fields, e.g. line_items[0][quantity]=2
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("currency", "cad");
  form.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${origin}/cart`);
  form.set("shipping_address_collection[allowed_countries][0]", "CA");
  form.set("phone_number_collection[enabled]", "true");
  if (body.email && /^\S+@\S+\.\S+$/.test(body.email)) form.set("customer_email", body.email);
  if (AUTOMATIC_TAX) form.set("automatic_tax[enabled]", "true");

  lines.forEach((l, i) => {
    const variant = [l.swatch, l.size && `Size ${l.size}`].filter(Boolean).join(" / ");
    form.set(`line_items[${i}][quantity]`, String(l.quantity));
    form.set(`line_items[${i}][price_data][currency]`, "cad");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(toCents(l.product.price)));
    form.set(`line_items[${i}][price_data][product_data][name]`, l.product.name);
    if (variant) form.set(`line_items[${i}][price_data][product_data][description]`, variant);
    form.set(`line_items[${i}][price_data][product_data][metadata][slug]`, l.product.slug);
  });

  form.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  form.set("shipping_options[0][shipping_rate_data][display_name]", shipping === 0 ? "Free standard shipping" : "Standard shipping");
  form.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(toCents(shipping)));
  form.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "cad");
  form.set("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]", "business_day");
  form.set("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]", "2");
  form.set("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]", "business_day");
  form.set("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]", "7");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  const session = (await res.json()) as { url?: string; error?: { message?: string } };
  if (!res.ok || !session.url) {
    console.error("Stripe checkout error:", session.error?.message);
    return Response.json({ message: "We couldn't start checkout. Please try again in a moment." }, { status: 502 });
  }
  return Response.json({ url: session.url });
}
