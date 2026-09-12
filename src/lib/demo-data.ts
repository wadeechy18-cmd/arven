import type { CategoryView, ProductWithRelations } from "@/lib/data";

// Static catalog used only when DEMO_MODE is true (src/lib/demo-mode.ts).
// Same shape the Supabase-backed queries return, so every page/component
// works unmodified in either mode.

export const DEMO_CATEGORIES: CategoryView[] = [
  {
    id: "cat-jute-bags",
    name: "Jute Bags",
    slug: "jute-bags",
    description: "Hand-woven from natural jute fibre — sturdy, breathable, and beautifully imperfect.",
    heroImage: "/placeholders/banner-editorial-01.svg",
    position: 1,
  },
  {
    id: "cat-leather-wallets",
    name: "Leather Wallets",
    slug: "leather-wallets",
    description: "Full-grain leather, vegetable-tanned and cut by hand. Softens and darkens with age.",
    heroImage: "/placeholders/banner-editorial-02.svg",
    position: 2,
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Small leather and jute goods for everyday carry.",
    heroImage: "/placeholders/banner-craft.svg",
    position: 3,
  },
];

const JUTE = ["texture-jute-01", "texture-jute-02", "texture-jute-03"];
const LEATHER = ["texture-leather-01", "texture-leather-02", "texture-leather-03"];
const img = (name: string) => `/placeholders/${name}.svg`;

function makeProduct(p: {
  id: string;
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
  category: CategoryView;
  images: string[];
  variants: { name: string; value: string; hex: string; stock: number }[];
  rating: number;
  reviewCount: number;
}): ProductWithRelations {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    material: p.material,
    dimensions: p.dimensions,
    careInstructions: p.care,
    origin: p.origin,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    sku: p.sku,
    stock: p.stock,
    featured: p.featured ?? false,
    isBestSeller: p.bestSeller ?? false,
    isNewArrival: p.newArrival ?? false,
    rating: p.rating,
    reviewCount: p.reviewCount,
    categoryId: p.category.id,
    category: p.category,
    images: p.images.map((name, i) => ({
      id: `${p.id}-img-${i}`,
      url: img(name),
      alt: `${p.name} — photo ${i + 1}`,
      position: i,
    })),
    variants: p.variants.map((v, i) => ({
      id: `${p.id}-var-${i}`,
      name: v.name,
      value: v.value,
      swatchHex: v.hex,
      priceDelta: 0,
      stock: v.stock,
      sku: `${p.sku}-${i + 1}`,
    })),
  };
}

const juteCategory = DEMO_CATEGORIES[0];
const leatherCategory = DEMO_CATEGORIES[1];
const accessoriesCategory = DEMO_CATEGORIES[2];

export const DEMO_PRODUCTS: ProductWithRelations[] = [
  makeProduct({
    id: "prod-amara-jute-tote",
    name: "Amara Jute Tote",
    slug: "amara-jute-tote",
    shortDescription: "An everyday tote in undyed jute with reinforced handles.",
    description:
      "Woven by hand from undyed jute fibre, the Amara Tote is built for daily errands and market runs alike. A reinforced base and double-stitched handles carry real weight without strain, while the natural weave softens beautifully with use.",
    material: "100% natural jute, cotton-lined interior",
    dimensions: "42 × 36 × 16 cm",
    care: "Spot clean with a damp cloth. Air dry away from direct sun.",
    origin: "Handwoven in West Bengal, India",
    price: 5800,
    sku: "JT-AMR-001",
    stock: 42,
    featured: true,
    bestSeller: true,
    category: juteCategory,
    images: [JUTE[0], JUTE[1]],
    variants: [
      { name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 20 },
      { name: "Trim", value: "Charcoal", hex: "#2A2420", stock: 22 },
    ],
    rating: 4.7,
    reviewCount: 45,
  }),
  makeProduct({
    id: "prod-kantha-market-bag",
    name: "Kantha Market Bag",
    slug: "kantha-market-bag",
    shortDescription: "A roomy, gusseted jute bag for the weekly market haul.",
    description:
      "Wide at the base and gently structured, the Kantha Market Bag holds a full week's groceries or a beach day's essentials without losing its shape. The open top and sturdy rope handles make it effortless to load and carry.",
    material: "100% natural jute",
    dimensions: "38 × 34 × 20 cm",
    care: "Spot clean only. Reshape while damp.",
    origin: "Handwoven in West Bengal, India",
    price: 4800,
    sku: "JT-KAN-002",
    stock: 55,
    category: juteCategory,
    images: [JUTE[1], JUTE[2]],
    variants: [
      { name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 30 },
      { name: "Trim", value: "Clay", hex: "#9C6B3F", stock: 25 },
    ],
    rating: 4.7,
    reviewCount: 166,
  }),
  makeProduct({
    id: "prod-coastal-jute-weekender",
    name: "Coastal Jute Weekender",
    slug: "coastal-jute-weekender",
    shortDescription: "A structured jute weekender for short trips and studio days.",
    description:
      "Part travel bag, part everyday carry-all, the Coastal Weekender pairs a jute exterior with a fully lined interior and an interior zip pocket for the small things you don't want to lose. Leather-wrapped handles add quiet structure.",
    material: "Jute exterior, cotton canvas lining, leather-wrapped handles",
    dimensions: "50 × 32 × 22 cm",
    care: "Spot clean exterior. Machine wash lining separately if removable.",
    origin: "Handwoven in West Bengal, India",
    price: 8400,
    sku: "JT-CST-003",
    stock: 18,
    newArrival: true,
    category: juteCategory,
    images: [JUTE[0], JUTE[2]],
    variants: [{ name: "Trim", value: "Espresso", hex: "#4A3626", stock: 18 }],
    rating: 4.9,
    reviewCount: 76,
  }),
  makeProduct({
    id: "prod-harvest-jute-shopper",
    name: "Harvest Jute Shopper",
    slug: "harvest-jute-shopper",
    shortDescription: "A light, foldable jute shopper for daily use.",
    description:
      "Lighter than our other totes but no less sturdy, the Harvest Shopper folds flat for storage and springs back into shape the moment it's loaded. A quiet, dependable bag for the daily commute.",
    material: "100% natural jute",
    dimensions: "40 × 34 × 12 cm",
    care: "Spot clean with a damp cloth.",
    origin: "Handwoven in West Bengal, India",
    price: 4200,
    sku: "JT-HRV-004",
    stock: 60,
    category: juteCategory,
    images: [JUTE[2], JUTE[0]],
    variants: [{ name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 60 }],
    rating: 4.8,
    reviewCount: 93,
  }),
  makeProduct({
    id: "prod-meadow-jute-tote",
    name: "Meadow Jute Tote — Natural",
    slug: "meadow-jute-tote-natural",
    shortDescription: "Our softest weave, finished with a rolled top edge.",
    description:
      "The Meadow Tote uses a finer jute weave for a softer hand-feel, finished with a rolled top edge and short, comfortable handles. A versatile everyday size that moves easily from desk to errands.",
    material: "100% natural jute",
    dimensions: "36 × 30 × 14 cm",
    care: "Spot clean with a damp cloth. Air dry away from direct sun.",
    origin: "Handwoven in West Bengal, India",
    price: 5200,
    compareAtPrice: 6200,
    sku: "JT-MDW-005",
    stock: 33,
    category: juteCategory,
    images: [JUTE[1], JUTE[0]],
    variants: [{ name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 33 }],
    rating: 4.7,
    reviewCount: 40,
  }),
  makeProduct({
    id: "prod-ashland-bifold",
    name: "Ashland Bifold Wallet",
    slug: "ashland-bifold-wallet",
    shortDescription: "A classic bifold in vegetable-tanned full-grain leather.",
    description:
      "Cut from a single hide and hand-stitched along every edge, the Ashland Bifold carries six card slots, a full-length note pocket, and a hidden slip pocket. Vegetable-tanned leather means it will darken and soften with age.",
    material: "Full-grain, vegetable-tanned leather",
    dimensions: "11 × 9 cm folded",
    care: "Wipe with a dry cloth. Condition with natural leather balm twice a year.",
    origin: "Hand-stitched in Léon, France",
    price: 7200,
    sku: "LW-ASH-001",
    stock: 40,
    featured: true,
    bestSeller: true,
    category: leatherCategory,
    images: [LEATHER[0], LEATHER[1]],
    variants: [
      { name: "Colour", value: "Espresso", hex: "#4A3626", stock: 20 },
      { name: "Colour", value: "Clay", hex: "#9C6B3F", stock: 20 },
    ],
    rating: 4.6,
    reviewCount: 176,
  }),
  makeProduct({
    id: "prod-merrow-cardholder",
    name: "Merrow Cardholder",
    slug: "merrow-cardholder",
    shortDescription: "A slim, pocket-friendly cardholder for the essentials.",
    description:
      "For carrying less, by design. The Merrow Cardholder fits four to six cards and folds flat in any pocket, cut from the same full-grain leather as the rest of the collection.",
    material: "Full-grain, vegetable-tanned leather",
    dimensions: "10 × 7 cm",
    care: "Wipe with a dry cloth. Condition occasionally.",
    origin: "Hand-stitched in Léon, France",
    price: 3800,
    sku: "LW-MER-002",
    stock: 65,
    newArrival: true,
    category: leatherCategory,
    images: [LEATHER[1], LEATHER[2]],
    variants: [
      { name: "Colour", value: "Charcoal", hex: "#2A2420", stock: 33 },
      { name: "Colour", value: "Espresso", hex: "#4A3626", stock: 32 },
    ],
    rating: 4.7,
    reviewCount: 91,
  }),
  makeProduct({
    id: "prod-journey-passport",
    name: "Journey Passport Sleeve",
    slug: "journey-passport-sleeve",
    shortDescription: "A travel companion with room for cards and boarding passes.",
    description:
      "Built for the trip, not just the flight. The Journey Sleeve holds a passport, two boarding passes, and a handful of cards, all wrapped in leather that only gets better with stamps and stories.",
    material: "Full-grain, vegetable-tanned leather",
    dimensions: "14.5 × 10 cm",
    care: "Wipe with a dry cloth. Avoid prolonged moisture.",
    origin: "Hand-stitched in Léon, France",
    price: 6400,
    sku: "LW-JRN-003",
    stock: 24,
    category: leatherCategory,
    images: [LEATHER[0], LEATHER[2]],
    variants: [{ name: "Colour", value: "Espresso", hex: "#4A3626", stock: 24 }],
    rating: 4.9,
    reviewCount: 154,
  }),
  makeProduct({
    id: "prod-foundry-slim",
    name: "Foundry Slim Wallet",
    slug: "foundry-slim-wallet",
    shortDescription: "A minimalist wallet with a single note pocket and four card slots.",
    description:
      "For those who carry little and carry it well. The Foundry Slim Wallet trims every unnecessary layer without sacrificing the full-grain leather and hand-stitched construction of the rest of the line.",
    material: "Full-grain, vegetable-tanned leather",
    dimensions: "9.5 × 7.5 cm",
    care: "Wipe with a dry cloth. Condition twice a year.",
    origin: "Hand-stitched in Léon, France",
    price: 5800,
    compareAtPrice: 6800,
    sku: "LW-FND-004",
    stock: 29,
    category: leatherCategory,
    images: [LEATHER[2], LEATHER[0]],
    variants: [{ name: "Colour", value: "Clay", hex: "#9C6B3F", stock: 29 }],
    rating: 4.6,
    reviewCount: 59,
  }),
  makeProduct({
    id: "prod-heritage-zip",
    name: "Heritage Zip Wallet",
    slug: "heritage-zip-wallet",
    shortDescription: "A zip-round wallet with coin pocket and eight card slots.",
    description:
      "The most spacious piece in the collection, the Heritage Zip Wallet closes securely around notes, coins, and cards alike — a dependable everyday-carry piece with an unmistakably substantial feel.",
    material: "Full-grain, vegetable-tanned leather, brass zip",
    dimensions: "13.5 × 10 cm",
    care: "Wipe with a dry cloth. Condition twice a year.",
    origin: "Hand-stitched in Léon, France",
    price: 7600,
    sku: "LW-HER-005",
    stock: 21,
    category: leatherCategory,
    images: [LEATHER[1], LEATHER[0]],
    variants: [{ name: "Colour", value: "Espresso", hex: "#4A3626", stock: 21 }],
    rating: 4.6,
    reviewCount: 28,
  }),
  makeProduct({
    id: "prod-camden-belt",
    name: "Camden Leather Belt",
    slug: "camden-leather-belt",
    shortDescription: "A full-grain belt with a solid brass buckle.",
    description:
      "Cut from a single strip of full-grain leather and finished with a solid brass buckle, the Camden Belt is built to be re-strapped, not replaced — a lifetime piece by design.",
    material: "Full-grain leather, solid brass hardware",
    dimensions: "3.5 cm width, sized to order",
    care: "Wipe with a dry cloth. Condition occasionally.",
    origin: "Hand-stitched in Léon, France",
    price: 5400,
    sku: "AC-CAM-001",
    stock: 37,
    category: accessoriesCategory,
    images: [LEATHER[0], LEATHER[2]],
    variants: [{ name: "Colour", value: "Espresso", hex: "#4A3626", stock: 37 }],
    rating: 4.8,
    reviewCount: 57,
  }),
  makeProduct({
    id: "prod-rowan-pouch",
    name: "Rowan Jute Pouch",
    slug: "rowan-jute-pouch",
    shortDescription: "A small zip pouch for cosmetics, cables, or coins.",
    description:
      "A small, sturdy companion to our totes — the Rowan Pouch keeps loose items contained inside a bag or a drawer, woven from the same natural jute as the rest of the collection.",
    material: "100% natural jute, cotton lining, brass zip",
    dimensions: "22 × 15 cm",
    care: "Spot clean with a damp cloth.",
    origin: "Handwoven in West Bengal, India",
    price: 2800,
    sku: "AC-ROW-002",
    stock: 70,
    newArrival: true,
    category: accessoriesCategory,
    images: [JUTE[2], JUTE[1]],
    variants: [{ name: "Trim", value: "Natural", hex: "#E6D9BF", stock: 70 }],
    rating: 4.7,
    reviewCount: 21,
  }),
  makeProduct({
    id: "prod-linden-fob",
    name: "Linden Key Fob",
    slug: "linden-key-fob",
    shortDescription: "A small leather fob with a solid brass clasp.",
    description:
      "A small detail that carries the same care as everything else we make — hand-cut leather, edge-burnished by hand, finished with a solid brass clasp.",
    material: "Full-grain leather, solid brass hardware",
    dimensions: "10 × 3 cm",
    care: "Wipe with a dry cloth.",
    origin: "Hand-stitched in Léon, France",
    price: 2200,
    sku: "AC-LND-003",
    stock: 80,
    category: accessoriesCategory,
    images: [LEATHER[2], LEATHER[1]],
    variants: [
      { name: "Colour", value: "Charcoal", hex: "#2A2420", stock: 40 },
      { name: "Colour", value: "Clay", hex: "#9C6B3F", stock: 40 },
    ],
    rating: 4.8,
    reviewCount: 154,
  }),
  makeProduct({
    id: "prod-sable-tote",
    name: "Sable Leather Tote",
    slug: "sable-leather-tote",
    shortDescription: "Our signature full-grain leather tote, made to last decades.",
    description:
      "The Sable Tote is the piece the collection is built around — a single cut of full-grain leather shaped into a structured tote with an interior zip pocket and hand-riveted straps. It arrives stiff and confident, and softens into something entirely your own.",
    material: "Full-grain, vegetable-tanned leather",
    dimensions: "40 × 30 × 14 cm",
    care: "Wipe with a dry cloth. Condition twice a year. Avoid prolonged rain exposure.",
    origin: "Hand-stitched in Léon, France",
    price: 12800,
    sku: "AC-SBL-004",
    stock: 15,
    featured: true,
    bestSeller: true,
    category: accessoriesCategory,
    images: [LEATHER[1], LEATHER[2]],
    variants: [
      { name: "Colour", value: "Espresso", hex: "#4A3626", stock: 8 },
      { name: "Colour", value: "Clay", hex: "#9C6B3F", stock: 7 },
    ],
    rating: 4.8,
    reviewCount: 61,
  }),
];
