/**
 * DEV-ONLY seed script. Loads demo Arven products/categories and a demo
 * admin + customer account into your Supabase project. Uses the
 * service-role key (bypasses RLS) — never run this against a production
 * project with real customer data, and never ship this key to a browser.
 *
 * Usage:
 *   npm run db:seed
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env — see .env.example.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

const JUTE = ["texture-jute-01", "texture-jute-02", "texture-jute-03"];
const LEATHER = ["texture-leather-01", "texture-leather-02", "texture-leather-03"];
const img = (name: string) => `/placeholders/${name}.svg`;

type SeedProduct = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  material: string;
  dimensions: string;
  care: string;
  origin: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  categorySlug: "jute-bags" | "leather-wallets" | "accessories";
  images: string[];
  variants: { name: string; value: string; hex: string; stock: number }[];
};

const products: SeedProduct[] = [
  {
    name: "Classic Jute Tote",
    slug: "classic-jute-tote",
    shortDescription: "An everyday tote in undyed jute with reinforced handles.",
    description:
      "Woven by hand from undyed jute fibre, the Classic Jute Tote is built for daily errands and market runs alike. A reinforced base and double-stitched handles carry real weight without strain.",
    material: "100% natural jute, cotton-lined interior",
    dimensions: "42 x 36 x 16 cm",
    care: "Spot clean with a damp cloth. Air dry away from direct sun.",
    origin: "Handwoven in West Bengal, India (demo data)",
    price: 5800,
    sku: "JT-CLS-001",
    stock: 42,
    featured: true,
    bestSeller: true,
    categorySlug: "jute-bags",
    images: [JUTE[0], JUTE[1]],
    variants: [
      { name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 20 },
      { name: "Trim", value: "Charcoal", hex: "#2A2420", stock: 22 },
    ],
  },
  {
    name: "Premium Jute Shopper",
    slug: "premium-jute-shopper",
    shortDescription: "A roomy, gusseted jute bag for the weekly market haul.",
    description:
      "Wide at the base and gently structured, the Premium Jute Shopper holds a full week's groceries without losing its shape.",
    material: "100% natural jute",
    dimensions: "38 x 34 x 20 cm",
    care: "Spot clean only. Reshape while damp.",
    origin: "Handwoven in West Bengal, India (demo data)",
    price: 4800,
    sku: "JT-PRM-002",
    stock: 55,
    newArrival: true,
    categorySlug: "jute-bags",
    images: [JUTE[1], JUTE[2]],
    variants: [{ name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 55 }],
  },
  {
    name: "Natural Jute Carry Bag",
    slug: "natural-jute-carry-bag",
    shortDescription: "A light, foldable jute carryall for daily use.",
    description:
      "Lighter than our other totes but no less sturdy, the Natural Jute Carry Bag folds flat for storage and springs back into shape the moment it's loaded.",
    material: "100% natural jute",
    dimensions: "40 x 34 x 12 cm",
    care: "Spot clean with a damp cloth.",
    origin: "Handwoven in West Bengal, India (demo data)",
    price: 4200,
    compareAtPrice: 4900,
    sku: "JT-NAT-003",
    stock: 60,
    categorySlug: "jute-bags",
    images: [JUTE[2], JUTE[0]],
    variants: [{ name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 60 }],
  },
  {
    name: "Classic Leather Wallet",
    slug: "classic-leather-wallet",
    shortDescription: "A classic bifold in vegetable-tanned full-grain leather.",
    description:
      "Cut from a single hide and hand-stitched along every edge, the Classic Leather Wallet carries six card slots and a full-length note pocket.",
    material: "Full-grain, vegetable-tanned leather",
    dimensions: "11 x 9 cm folded",
    care: "Wipe with a dry cloth. Condition with natural leather balm twice a year.",
    origin: "Hand-stitched in Léon, France (demo data)",
    price: 7200,
    sku: "LW-CLS-001",
    stock: 40,
    featured: true,
    bestSeller: true,
    categorySlug: "leather-wallets",
    images: [LEATHER[0], LEATHER[1]],
    variants: [
      { name: "Colour", value: "Espresso", hex: "#4A3626", stock: 20 },
      { name: "Colour", value: "Clay", hex: "#9C6B3F", stock: 20 },
    ],
  },
  {
    name: "Slim Leather Wallet",
    slug: "slim-leather-wallet",
    shortDescription: "A minimalist wallet with a single note pocket and four card slots.",
    description:
      "For those who carry little and carry it well. The Slim Leather Wallet trims every unnecessary layer without sacrificing full-grain leather and hand-stitched construction.",
    material: "Full-grain, vegetable-tanned leather",
    dimensions: "9.5 x 7.5 cm",
    care: "Wipe with a dry cloth. Condition twice a year.",
    origin: "Hand-stitched in Léon, France (demo data)",
    price: 5800,
    compareAtPrice: 6800,
    sku: "LW-SLM-002",
    stock: 29,
    newArrival: true,
    categorySlug: "leather-wallets",
    images: [LEATHER[2], LEATHER[0]],
    variants: [{ name: "Colour", value: "Clay", hex: "#9C6B3F", stock: 29 }],
  },
  {
    name: "Premium Leather Bifold",
    slug: "premium-leather-bifold",
    shortDescription: "A zip-round wallet with coin pocket and eight card slots.",
    description:
      "The most spacious piece in the collection, the Premium Leather Bifold closes securely around notes, coins, and cards alike.",
    material: "Full-grain, vegetable-tanned leather, brass zip",
    dimensions: "13.5 x 10 cm",
    care: "Wipe with a dry cloth. Condition twice a year.",
    origin: "Hand-stitched in Léon, France (demo data)",
    price: 7600,
    sku: "LW-PRM-003",
    stock: 21,
    categorySlug: "leather-wallets",
    images: [LEATHER[1], LEATHER[0]],
    variants: [{ name: "Colour", value: "Espresso", hex: "#4A3626", stock: 21 }],
  },
];

async function main() {
  console.log("Seeding demo data into Supabase — this is DEV/DEMO data only.\n");

  const categories = [
    {
      name: "Jute Bags",
      slug: "jute-bags",
      description: "Hand-woven from natural jute fibre.",
      image_url: img("banner-editorial-01"),
      position: 1,
    },
    {
      name: "Leather Wallets",
      slug: "leather-wallets",
      description: "Full-grain leather, vegetable-tanned and cut by hand.",
      image_url: img("banner-editorial-02"),
      position: 2,
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Small leather and jute goods for everyday carry.",
      image_url: img("banner-craft"),
      position: 3,
    },
  ];

  const categoryIds: Record<string, string> = {};
  for (const c of categories) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(c, { onConflict: "slug" })
      .select("id, slug")
      .single();
    if (error) throw error;
    categoryIds[data.slug] = data.id;
  }
  console.log(`Upserted ${categories.length} categories.`);

  for (const p of products) {
    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          name: p.name,
          slug: p.slug,
          short_description: p.shortDescription,
          description: p.description,
          material: p.material,
          dimensions: p.dimensions,
          care_instructions: p.care,
          origin: p.origin,
          price: p.price,
          compare_at_price: p.compareAtPrice ?? null,
          sku: p.sku,
          stock_quantity: p.stock,
          featured: p.featured ?? false,
          is_best_seller: p.bestSeller ?? false,
          is_new_arrival: p.newArrival ?? false,
          category_id: categoryIds[p.categorySlug],
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;

    await supabase.from("product_images").delete().eq("product_id", product.id);
    await supabase.from("product_images").insert(
      p.images.map((name, i) => ({
        product_id: product.id,
        image_url: img(name),
        alt_text: `${p.name} — photo ${i + 1}`,
        sort_order: i,
      })),
    );

    await supabase.from("product_variants").delete().eq("product_id", product.id);
    if (p.variants.length > 0) {
      await supabase.from("product_variants").insert(
        p.variants.map((v, i) => ({
          product_id: product.id,
          name: v.name,
          value: v.value,
          swatch_hex: v.hex,
          stock_quantity: v.stock,
          sku: `${p.sku}-${i + 1}`,
        })),
      );
    }
  }
  console.log(`Upserted ${products.length} demo products.`);

  console.log(
    "\nDone. To try the admin dashboard, promote an existing account to admin:\n" +
      "  update public.profiles set role = 'admin' where email = 'you@example.com';\n" +
      "(Sign up through /register first so the profile row exists, then run that in the Supabase SQL Editor.)",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
