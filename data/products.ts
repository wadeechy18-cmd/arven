/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DAYMARK PRODUCT CATALOGUE
 *  Every product on the site lives in this one file. Edit, add or remove
 *  products here; pages, menus, search and filters update automatically.
 *
 *  Quick guide to the fields:
 *   slug            URL name, lowercase-with-dashes, must be unique.
 *                   Also names the photos: /public/images/products/<category>/<slug>-1.jpg, -2.jpg …
 *   category        "clothing" | "makeup" | "jute-bags"
 *   subcategory     Must match a sub-category path in data/navigation.ts
 *                   (e.g. "mens/t-shirts", "womens/dresses", "lips", "totes").
 *   price           Price in Canadian dollars (e.g. 48 or 48.5).
 *   compareAtPrice  Optional. The original price. Setting it puts the product on sale
 *                   (shows strikethrough, "% off" badge, and adds it to Sale).
 *   swatches        Colours (clothing, bags) or shades (makeup). hex = swatch colour.
 *   sizes           Optional. Sizes to pick from (clothing).
 *   images          How many photos the product has (default 3). Photo 1 is the main
 *                   image, photo 2 shows when hovering a product card.
 *   bestSeller/isNew  Flags that place the product in Best Sellers / New Arrivals.
 *   dateAdded       YYYY-MM-DD. Used by the "Newest" sort.
 *   details         The tabs on the product page (after "Description").
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Category = "clothing" | "makeup" | "jute-bags";

export interface Swatch {
  name: string;
  hex: string;
}

export interface Product {
  slug: string;
  name: string;
  category: Category;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  swatches?: Swatch[];
  sizes?: string[];
  images?: number;
  bestSeller?: boolean;
  isNew?: boolean;
  dateAdded: string;
  shortDescription: string;
  description: string;
  details: { title: string; body: string }[];
}

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const products: Product[] = [
  // ───────────────────────────── CLOTHING ─────────────────────────────
  {
    slug: "everyday-organic-tee",
    name: "Everyday Organic Tee",
    category: "clothing",
    subcategory: "mens/t-shirts",
    price: 38,
    swatches: [
      { name: "Bone", hex: "#ece6da" },
      { name: "Charcoal", hex: "#3a3936" },
      { name: "Olive", hex: "#6b6e4a" },
      { name: "Navy", hex: "#283447" },
      { name: "Clay", hex: "#b77a5c" },
      { name: "Black", hex: "#141414" },
    ],
    sizes: CLOTHING_SIZES,
    bestSeller: true,
    dateAdded: "2026-03-02",
    shortDescription: "A mid-weight organic cotton tee with a relaxed, true-to-size fit.",
    description:
      "The tee you reach for first. Cut from 200 gsm organic cotton jersey that softens with every wash, with a slightly dropped shoulder and a ribbed crew neck that holds its shape. Pre-shrunk, so the fit you buy is the fit you keep.",
    details: [
      { title: "Materials", body: "100% GOTS-certified organic cotton, 200 gsm jersey. Pre-shrunk." },
      { title: "Care", body: "Machine wash cold with like colours. Tumble dry low or line dry. Warm iron if needed." },
    ],
  },
  {
    slug: "harbour-oxford-shirt",
    name: "Harbour Oxford Shirt",
    category: "clothing",
    subcategory: "mens/shirts",
    price: 79,
    compareAtPrice: 110,
    swatches: [
      { name: "White", hex: "#f7f6f2" },
      { name: "Sky", hex: "#a9c1d9" },
      { name: "Stone", hex: "#c9bfae" },
    ],
    sizes: CLOTHING_SIZES,
    dateAdded: "2026-01-18",
    shortDescription: "A classic button-down in brushed cotton Oxford cloth.",
    description:
      "Smart enough for the office, easy enough for the weekend. Our Oxford is woven from long-staple cotton and lightly brushed for softness, with a button-down collar, a single chest pocket and a curved hem that works tucked or untucked.",
    details: [
      { title: "Materials", body: "100% long-staple cotton Oxford cloth. Corozo nut buttons." },
      { title: "Care", body: "Machine wash warm. Hang to dry and iron while slightly damp for a crisp finish." },
    ],
  },
  {
    slug: "dundas-relaxed-chino",
    name: "Dundas Relaxed Chino",
    category: "clothing",
    subcategory: "mens/pants",
    price: 98,
    swatches: [
      { name: "Khaki", hex: "#b9a57f" },
      { name: "Charcoal", hex: "#3d3d3b" },
      { name: "Olive", hex: "#5d6346" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    isNew: true,
    dateAdded: "2026-09-12",
    shortDescription: "A relaxed, tapered chino in garment-dyed cotton twill.",
    description:
      "Roomy through the hip and thigh with a gentle taper to the ankle. Garment-dyed for a lived-in colour from day one, with a touch of stretch for easy movement and a hidden coin pocket.",
    details: [
      { title: "Materials", body: "98% organic cotton, 2% elastane twill. Garment dyed." },
      { title: "Care", body: "Machine wash cold inside out. Line dry to keep colour rich." },
    ],
  },
  {
    slug: "ossington-chore-jacket",
    name: "Ossington Chore Jacket",
    category: "clothing",
    subcategory: "mens/jackets",
    price: 168,
    swatches: [
      { name: "Tobacco", hex: "#7a5434" },
      { name: "Navy", hex: "#26324a" },
    ],
    sizes: CLOTHING_SIZES,
    bestSeller: true,
    dateAdded: "2025-11-04",
    shortDescription: "A heavyweight canvas work jacket with three patch pockets.",
    description:
      "Built in sturdy 12 oz cotton canvas that breaks in beautifully over time. A boxy, layer-friendly cut with three roomy patch pockets, a corduroy-lined collar and tough bar-tacked seams.",
    details: [
      { title: "Materials", body: "100% cotton canvas, 12 oz. Corduroy collar. Metal shank buttons." },
      { title: "Care", body: "Machine wash cold, gentle cycle. Line dry. Expect natural fading over time." },
    ],
  },
  {
    slug: "linen-boxy-top",
    name: "Linen Boxy Top",
    category: "clothing",
    subcategory: "womens/tops",
    price: 58,
    swatches: [
      { name: "Oat", hex: "#e2d6c1" },
      { name: "White", hex: "#f8f7f3" },
      { name: "Sage", hex: "#a5ae93" },
      { name: "Terracotta", hex: "#b4644a" },
      { name: "Black", hex: "#161616" },
    ],
    sizes: CLOTHING_SIZES,
    isNew: true,
    bestSeller: true,
    dateAdded: "2026-08-28",
    shortDescription: "An airy, cropped linen top with a wide neckline.",
    description:
      "Breathable European linen in an easy boxy shape that sits just at the waist. Stone-washed for softness, with clean side vents. Pair it with high-rise trousers or tuck it into a skirt.",
    details: [
      { title: "Materials", body: "100% European flax linen, stone washed." },
      { title: "Care", body: "Machine wash cold, gentle. Line dry. Linen creases naturally; that's part of its charm." },
    ],
  },
  {
    slug: "kensington-midi-dress",
    name: "Kensington Midi Dress",
    category: "clothing",
    subcategory: "womens/dresses",
    price: 118,
    compareAtPrice: 160,
    swatches: [
      { name: "Olive", hex: "#5e6345" },
      { name: "Ink", hex: "#1f2633" },
      { name: "Rust", hex: "#9c4f2e" },
    ],
    sizes: CLOTHING_SIZES,
    bestSeller: true,
    dateAdded: "2026-04-10",
    shortDescription: "A fluid midi dress with a tie waist and side pockets.",
    description:
      "Cut on the bias from a fluid Tencel twill that drapes and moves. A V-neck, a removable tie at the waist and, yes, deep side pockets. Dresses up with a heel or down with sneakers.",
    details: [
      { title: "Materials", body: "100% Tencel™ Lyocell twill, from responsibly sourced wood pulp." },
      { title: "Care", body: "Hand wash or machine wash cold on delicate. Hang to dry. Cool iron." },
    ],
  },
  {
    slug: "wide-leg-linen-trouser",
    name: "Wide-Leg Linen Trouser",
    category: "clothing",
    subcategory: "womens/pants",
    price: 96,
    swatches: [
      { name: "Oat", hex: "#e2d6c1" },
      { name: "Black", hex: "#161616" },
      { name: "Sage", hex: "#a5ae93" },
    ],
    sizes: CLOTHING_SIZES,
    dateAdded: "2026-05-22",
    shortDescription: "High-rise, wide-leg trousers in breathable linen.",
    description:
      "A high-rise, full-length wide leg with a flat front and a partially elasticated back waistband for comfort. Mid-weight linen means they're opaque, cool and endlessly wearable.",
    details: [
      { title: "Materials", body: "100% European flax linen, mid-weight. Recycled polyester lining at pockets." },
      { title: "Care", body: "Machine wash cold, gentle. Line dry. Warm iron." },
    ],
  },
  {
    slug: "lakeshore-trench",
    name: "Lakeshore Trench",
    category: "clothing",
    subcategory: "womens/outerwear",
    price: 228,
    swatches: [
      { name: "Sand", hex: "#cdb995" },
      { name: "Charcoal", hex: "#3a3a38" },
    ],
    sizes: CLOTHING_SIZES,
    isNew: true,
    dateAdded: "2026-09-30",
    shortDescription: "A water-resistant cotton trench for Toronto's in-between seasons.",
    description:
      "A modern take on the classic trench: a tightly woven cotton gabardine with a water-repellent finish, an easy relaxed fit and a removable belt. Long enough for coverage, light enough to layer.",
    details: [
      { title: "Materials", body: "100% cotton gabardine with PFC-free water-repellent finish. Cupro lining." },
      { title: "Care", body: "Dry clean recommended. Spot clean between wears." },
    ],
  },

  // ───────────────────────────── MAKEUP ─────────────────────────────
  {
    slug: "skin-tint-serum",
    name: "Skin Tint Serum",
    category: "makeup",
    subcategory: "face",
    price: 42,
    swatches: [
      { name: "01 Porcelain", hex: "#f3dccb" },
      { name: "02 Fair", hex: "#ecd0b8" },
      { name: "03 Light", hex: "#e2bf9f" },
      { name: "04 Light Medium", hex: "#d6ac88" },
      { name: "05 Medium", hex: "#c69771" },
      { name: "06 Medium Tan", hex: "#b4835d" },
      { name: "07 Tan", hex: "#9c6c48" },
      { name: "08 Deep", hex: "#7f5437" },
      { name: "09 Rich", hex: "#633f29" },
      { name: "10 Espresso", hex: "#4a2e1e" },
    ],
    bestSeller: true,
    dateAdded: "2026-02-14",
    shortDescription: "Sheer, skin-like coverage with hyaluronic acid and niacinamide.",
    description:
      "A weightless serum tint that evens skin while letting it look like skin. Buildable sheer-to-light coverage with a natural, dewy finish. Hydrates for up to 12 hours and blurs without settling into lines.",
    details: [
      {
        title: "Ingredients",
        body: "Aqua, Squalane, Glycerin, Niacinamide, Sodium Hyaluronate, Caprylic/Capric Triglyceride, Tocopherol, Iron Oxides (CI 77491, CI 77492, CI 77499), Titanium Dioxide (CI 77891). Fragrance-free. Vegan and cruelty-free.",
      },
      { title: "How to use", body: "Shake well. Apply 2–3 drops with fingertips or a brush, blending outward from the centre of the face. Layer for more coverage." },
    ],
  },
  {
    slug: "cream-blush-balm",
    name: "Cream Blush Balm",
    category: "makeup",
    subcategory: "face",
    price: 22,
    compareAtPrice: 28,
    swatches: [
      { name: "Petal", hex: "#e4a3a0" },
      { name: "Apricot", hex: "#e39a76" },
      { name: "Fig", hex: "#a8545a" },
      { name: "Berry", hex: "#8e3b4c" },
    ],
    dateAdded: "2026-06-03",
    shortDescription: "A melt-in cream blush for cheeks and lips.",
    description:
      "A soft balm that melts into skin for a healthy, from-within flush. Blendable with fingertips, layerable for more colour, and gentle enough to tap onto lips too.",
    details: [
      { title: "Ingredients", body: "Caprylic/Capric Triglyceride, Shea Butter, Candelilla Wax, Jojoba Oil, Vitamin E, Mica, Iron Oxides. Vegan and cruelty-free." },
      { title: "How to use", body: "Tap onto the apples of the cheeks with fingertips and blend upward. Build in thin layers." },
    ],
  },
  {
    slug: "soft-definition-mascara",
    name: "Soft Definition Mascara",
    category: "makeup",
    subcategory: "eyes",
    price: 26,
    swatches: [
      { name: "Black", hex: "#121212" },
      { name: "Brown", hex: "#4a3226" },
    ],
    bestSeller: true,
    dateAdded: "2025-10-20",
    shortDescription: "Lengthening, smudge-proof mascara that washes off with warm water.",
    description:
      "A tubing mascara that wraps every lash for soft length and separation without clumps. Won't flake or smudge through the day, then slips off with warm water: no rubbing required.",
    details: [
      { title: "Ingredients", body: "Aqua, Acrylates Copolymer, Glycerin, Beeswax-free wax blend, Panthenol, Iron Oxides. Ophthalmologist tested." },
      { title: "How to use", body: "Wiggle the brush from root to tip. Add a second coat while the first is still wet. Remove with warm water." },
    ],
  },
  {
    slug: "satin-lipstick",
    name: "Satin Lipstick",
    category: "makeup",
    subcategory: "lips",
    price: 30,
    swatches: [
      { name: "Bare", hex: "#c48a78" },
      { name: "Rosewood", hex: "#a45f5f" },
      { name: "Terracotta", hex: "#b35a3f" },
      { name: "Classic Red", hex: "#a8232b" },
      { name: "Mulberry", hex: "#6f2c3f" },
      { name: "Cinnamon", hex: "#8a4a33" },
      { name: "Plum", hex: "#5b2a3d" },
    ],
    bestSeller: true,
    dateAdded: "2026-01-05",
    shortDescription: "Comfortable, full-colour lipstick with a soft satin finish.",
    description:
      "Rich colour in one swipe with a cushiony, hydrating feel. Our satin formula is made with plant oils for comfort and won't dry out lips. Refillable aluminium case.",
    details: [
      { title: "Ingredients", body: "Ricinus Communis Seed Oil, Candelilla Wax, Jojoba Oil, Shea Butter, Tocopherol, Mica, Iron Oxides, Red 7 Lake. Vegan." },
      { title: "How to use", body: "Apply directly from the bullet, starting at the centre of the lips and working outward." },
    ],
  },
  {
    slug: "tinted-lip-oil",
    name: "Tinted Lip Oil",
    category: "makeup",
    subcategory: "lips",
    price: 24,
    swatches: [
      { name: "Clear", hex: "#f1e6dc" },
      { name: "Rose", hex: "#d68f8e" },
      { name: "Cherry", hex: "#a22d3a" },
    ],
    isNew: true,
    dateAdded: "2026-09-18",
    shortDescription: "A non-sticky lip oil with a sheer wash of colour.",
    description:
      "Glossy shine without the stick. A blend of nourishing oils softens lips while a sheer tint adds just enough colour for every day.",
    details: [
      { title: "Ingredients", body: "Squalane, Jojoba Seed Oil, Rosehip Oil, Vitamin E, Natural Flavour, Iron Oxides. Vegan." },
      { title: "How to use", body: "Glide on alone or layer over lipstick for shine. Reapply as often as you like." },
    ],
  },
  {
    slug: "nail-colour",
    name: "Nail Colour",
    category: "makeup",
    subcategory: "nails",
    price: 16,
    compareAtPrice: 20,
    swatches: [
      { name: "Linen", hex: "#e8dccb" },
      { name: "Blush", hex: "#d9a7a0" },
      { name: "Clay", hex: "#b57455" },
      { name: "Moss", hex: "#5d6447" },
      { name: "Oxblood", hex: "#5b1f25" },
      { name: "Ink", hex: "#1f2430" },
    ],
    dateAdded: "2025-12-01",
    shortDescription: "A 10-free, long-wear nail colour in earthy shades.",
    description:
      "Chip-resistant colour with a glossy finish, formulated without the 10 most common harsh chemicals. Two coats give full, even coverage.",
    details: [
      { title: "Ingredients", body: "10-free formula: no formaldehyde, toluene, DBP, camphor, formaldehyde resin, TPHP, xylene, parabens, ethyl tosylamide or animal-derived ingredients." },
      { title: "How to use", body: "Apply over a base coat in two thin layers. Finish with a top coat for extra wear." },
    ],
  },
  {
    slug: "essential-brush-set",
    name: "Essential Brush Set",
    category: "makeup",
    subcategory: "tools",
    price: 64,
    bestSeller: true,
    dateAdded: "2026-03-15",
    shortDescription: "Five vegan brushes with bamboo handles in a jute roll.",
    description:
      "Everything you need for a full face: foundation, powder, blush, shadow and detail brushes. Ultra-soft synthetic bristles, sustainably harvested bamboo handles and a jute travel roll made in our own workshop.",
    details: [
      { title: "Materials", body: "Synthetic Taklon bristles, bamboo handles, aluminium ferrules. Jute and cotton roll." },
      { title: "Care", body: "Wash weekly with mild soap and lukewarm water. Reshape and dry flat." },
    ],
  },
  {
    slug: "daymark-edit-gift-set",
    name: "The Daymark Edit Gift Set",
    category: "makeup",
    subcategory: "sets",
    price: 79,
    compareAtPrice: 98,
    isNew: true,
    dateAdded: "2026-09-25",
    shortDescription: "Skin tint, mascara and lip oil in a reusable jute pouch.",
    description:
      "Our three most-loved everyday essentials together in a gift-ready jute pouch. Includes a shade-match card, so the Skin Tint can be swapped for free if the shade isn't quite right.",
    details: [
      { title: "What's inside", body: "Skin Tint Serum (30 ml), Soft Definition Mascara in Black (8 ml), Tinted Lip Oil in Rose (4 ml), Jute Zip Pouch." },
      { title: "Ingredients", body: "See individual products for full ingredient lists. All vegan and cruelty-free." },
    ],
  },

  // ───────────────────────────── JUTE BAGS ─────────────────────────────
  {
    slug: "market-jute-tote",
    name: "Market Jute Tote",
    category: "jute-bags",
    subcategory: "totes",
    price: 48,
    swatches: [
      { name: "Natural", hex: "#c2a36b" },
      { name: "Charcoal", hex: "#3a3936" },
      { name: "Olive", hex: "#6b6e4a" },
    ],
    bestSeller: true,
    dateAdded: "2025-09-10",
    shortDescription: "Our signature handwoven jute tote with cotton webbing handles.",
    description:
      "The bag that started it all. Woven by hand from golden jute fibre, lined with cotton canvas and finished with soft webbing handles that sit comfortably on the shoulder. Big enough for a farmers' market haul, structured enough to carry every day.",
    details: [
      { title: "Materials", body: "100% natural jute exterior, organic cotton canvas lining, cotton webbing handles. Interior slip pocket." },
      { title: "Dimensions", body: "W 45 cm × H 36 cm × D 15 cm. Handle drop 25 cm. Holds up to 12 kg." },
      { title: "Care", body: "Spot clean with a damp cloth and mild soap. Air dry. Do not machine wash or bleach." },
    ],
  },
  {
    slug: "leather-handle-jute-tote",
    name: "Leather-Handle Jute Tote",
    category: "jute-bags",
    subcategory: "totes",
    price: 78,
    swatches: [
      { name: "Natural / Tan", hex: "#b08a55" },
      { name: "Natural / Black", hex: "#2b2a28" },
    ],
    isNew: true,
    dateAdded: "2026-09-05",
    shortDescription: "A refined jute tote with vegetable-tanned leather handles.",
    description:
      "Tightly woven jute meets vegetable-tanned leather handles that age into a rich patina. A magnetic closure, zip inner pocket and key clip make it a true everyday bag.",
    details: [
      { title: "Materials", body: "Natural jute, vegetable-tanned leather handles, cotton lining, brass hardware." },
      { title: "Dimensions", body: "W 40 cm × H 32 cm × D 14 cm. Handle drop 22 cm." },
      { title: "Care", body: "Spot clean jute. Condition leather twice a year. Keep away from prolonged moisture." },
    ],
  },
  {
    slug: "big-haul-shopping-bag",
    name: "Big Haul Shopping Bag",
    category: "jute-bags",
    subcategory: "shopping-bags",
    price: 32,
    swatches: [
      { name: "Natural", hex: "#c2a36b" },
      { name: "Indigo Stripe", hex: "#2f4766" },
    ],
    bestSeller: true,
    dateAdded: "2025-10-02",
    shortDescription: "An extra-large, reinforced jute bag for the weekly shop.",
    description:
      "Replace a stack of plastic bags with one that lasts for years. A wide, flat base, reinforced seams and laminated interior make it ideal for heavy groceries.",
    details: [
      { title: "Materials", body: "Natural jute with food-safe laminated interior, jute rope handles." },
      { title: "Dimensions", body: "W 50 cm × H 38 cm × D 20 cm. Holds up to 15 kg." },
      { title: "Care", body: "Wipe interior clean. Spot clean exterior. Air dry." },
    ],
  },
  {
    slug: "foldaway-grocery-bag",
    name: "Foldaway Grocery Bag",
    category: "jute-bags",
    subcategory: "shopping-bags",
    price: 22,
    compareAtPrice: 28,
    swatches: [
      { name: "Natural", hex: "#c2a36b" },
      { name: "Sage", hex: "#a5ae93" },
      { name: "Terracotta", hex: "#b4644a" },
      { name: "Charcoal", hex: "#3a3936" },
      { name: "Indigo", hex: "#2f4766" },
    ],
    dateAdded: "2026-02-20",
    shortDescription: "A soft jute-blend bag that folds into its own pocket.",
    description:
      "Keep one in every coat and car. A soft jute and cotton blend that folds into its built-in pocket and snaps shut, so you're never caught without a bag.",
    details: [
      { title: "Materials", body: "60% jute, 40% organic cotton. Snap closure." },
      { title: "Dimensions", body: "Open: W 42 cm × H 38 cm. Folded: 12 × 12 cm." },
      { title: "Care", body: "Hand wash cold. Air dry flat." },
    ],
  },
  {
    slug: "roll-top-jute-backpack",
    name: "Roll-Top Jute Backpack",
    category: "jute-bags",
    subcategory: "backpacks",
    price: 118,
    swatches: [
      { name: "Natural", hex: "#c2a36b" },
      { name: "Olive", hex: "#5d6346" },
    ],
    isNew: true,
    dateAdded: "2026-08-15",
    shortDescription: "A roll-top backpack with a padded 15\" laptop sleeve.",
    description:
      "Jute woven with a water-resistant cotton backing for everyday commuting. The expandable roll-top adds room when you need it, while padded straps and a 15-inch laptop sleeve keep things comfortable.",
    details: [
      { title: "Materials", body: "Jute and waxed cotton exterior, recycled polyester lining, padded cotton straps, brass hardware." },
      { title: "Dimensions", body: "W 30 cm × H 44–52 cm × D 14 cm. Capacity 18–22 L. Fits 15\" laptop." },
      { title: "Care", body: "Spot clean. Re-wax cotton panels yearly to refresh water resistance." },
    ],
  },
  {
    slug: "everyday-crossbody",
    name: "Everyday Crossbody",
    category: "jute-bags",
    subcategory: "crossbodies",
    price: 64,
    swatches: [
      { name: "Natural", hex: "#c2a36b" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    bestSeller: true,
    dateAdded: "2026-04-28",
    shortDescription: "A compact jute crossbody with an adjustable cotton strap.",
    description:
      "Hands-free and just the right size for phone, wallet and keys. Finely woven jute with a zip top, a slip pocket on the back and an adjustable strap that sits at the hip or across the body.",
    details: [
      { title: "Materials", body: "Natural jute, cotton lining, adjustable cotton webbing strap, YKK zip." },
      { title: "Dimensions", body: "W 24 cm × H 17 cm × D 7 cm. Strap drop 50–62 cm." },
      { title: "Care", body: "Spot clean with a damp cloth. Air dry." },
    ],
  },
  {
    slug: "zip-pouch-trio",
    name: "Zip Pouch Trio",
    category: "jute-bags",
    subcategory: "pouches",
    price: 34,
    swatches: [{ name: "Natural", hex: "#c2a36b" }],
    dateAdded: "2026-05-02",
    shortDescription: "Three nesting jute pouches for makeup, cables and travel bits.",
    description:
      "Small, medium and large zip pouches that nest together. Lined for easy wipe-clean, perfect for makeup, chargers or everything at the bottom of your bag.",
    details: [
      { title: "Materials", body: "Natural jute, coated cotton lining, metal zips with leather pulls." },
      { title: "Dimensions", body: "Small 15 × 10 cm, Medium 20 × 13 cm, Large 25 × 16 cm." },
      { title: "Care", body: "Wipe lining clean. Spot clean exterior." },
    ],
  },
  {
    slug: "jute-laptop-sleeve",
    name: "Jute Laptop Sleeve",
    category: "jute-bags",
    subcategory: "pouches",
    price: 42,
    compareAtPrice: 58,
    swatches: [
      { name: "Natural", hex: "#c2a36b" },
      { name: "Charcoal", hex: "#3a3936" },
    ],
    dateAdded: "2025-11-20",
    shortDescription: "A padded jute sleeve for 13\" and 14\" laptops.",
    description:
      "A slim, padded sleeve that slides into any tote. Jute outside, soft felt inside, with a leather tab closure.",
    details: [
      { title: "Materials", body: "Natural jute, recycled PET felt padding, leather tab." },
      { title: "Dimensions", body: "36 × 26 cm. Fits most 13\" and 14\" laptops." },
      { title: "Care", body: "Spot clean. Air dry." },
    ],
  },
];

// ───────────────────────────── Helpers ─────────────────────────────

/** Photo paths for a product: /images/products/<category>/<slug>-1.jpg, -2.jpg … */
export function productImages(p: Product): string[] {
  const count = p.images ?? 3;
  return Array.from({ length: count }, (_, i) => `/images/products/${p.category}/${p.slug}-${i + 1}.jpg`);
}

/** Recommended product photo size (portrait 4:5). */
export const PRODUCT_IMAGE_SIZE = { width: 1600, height: 2000 };

export function isOnSale(p: Product): boolean {
  return p.compareAtPrice !== undefined && p.compareAtPrice > p.price;
}

export function percentOff(p: Product): number {
  if (!isOnSale(p)) return 0;
  return Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** "Colour" for clothing and bags, "Shade" for makeup. */
export function swatchLabel(p: Product): string {
  return p.category === "makeup" ? "Shade" : "Colour";
}
