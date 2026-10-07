/**
 * Site-wide settings. Edit text here: no component changes needed.
 */

/**
 * The live web address, used for SEO tags and the sitemap. Set NEXT_PUBLIC_SITE_URL
 * (e.g. https://daymark.ca). Falls back to Vercel's own address, then daymark.ca.
 */
function resolveSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  try {
    return new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    return "https://daymark.ca";
  }
}

export const site = {
  name: "Daymark",
  tagline: "Everyday essentials, made to last.",
  description:
    "Daymark is a Toronto brand making considered clothing, clean makeup and handwoven jute bags. Free shipping across Canada on orders over $99.",
  url: resolveSiteUrl(),
  email: "radifchowdhury13@gmail.com",
  location: "Toronto, Ontario, Canada",
  currency: "CAD",
  locale: "en-CA",
  freeShippingThreshold: 99,
  flatShippingRate: 12,
  returnWindowDays: 30,
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
    pinterest: "https://pinterest.com/",
  },
};

/** Messages that rotate in the bar at the very top of every page. */
export const announcements: { text: string; href?: string }[] = [
  { text: "Free shipping across Canada on orders over $99", href: "/shipping" },
  { text: "Seasonal sale: save on selected styles", href: "/collections/sale" },
  { text: "Free 30-day returns on all full-price items", href: "/returns" },
];

/** The three promises shown in the mega menu and on the home page. */
export const trustPoints = [
  { icon: "truck", title: "Free shipping", text: "On Canadian orders over $99" },
  { icon: "return", title: "Easy returns", text: "30 days, no fuss" },
  { icon: "leaf", title: "Made to last", text: "Natural fibres, careful craft" },
] as const;
