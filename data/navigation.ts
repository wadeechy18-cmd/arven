/**
 * Menus and collections. The header mega menu, mobile drawer, collection pages
 * and filters are all built from this file.
 *
 * A product's `subcategory` in data/products.ts must match one of the paths below:
 * group slug + item slug ("mens/t-shirts"), or just the item slug when the
 * group has no slug ("face", "totes").
 */
import type { Category } from "./products";
import { images, type SiteImage } from "./images";

export interface SubCategory {
  slug: string;
  label: string;
}

export interface CategoryGroup {
  /** Optional URL segment (e.g. "mens"). Groups without one are just column headings. */
  slug?: string;
  label: string;
  items: SubCategory[];
}

export interface CategoryDef {
  slug: Category;
  label: string;
  description: string;
  banner: SiteImage;
  groups: CategoryGroup[];
  promo: { image: SiteImage; title: string; text: string; href: string };
  /** Which filters make sense for this category. */
  filters: { size: boolean };
}

export const categories: CategoryDef[] = [
  {
    slug: "clothing",
    label: "Clothing",
    description: "Considered everyday clothing in organic cotton, linen and natural fibres. Designed in Toronto.",
    banner: images.bannerClothing,
    groups: [
      {
        slug: "mens",
        label: "Men's",
        items: [
          { slug: "t-shirts", label: "T-Shirts" },
          { slug: "shirts", label: "Shirts" },
          { slug: "pants", label: "Pants" },
          { slug: "jackets", label: "Jackets" },
        ],
      },
      {
        slug: "womens",
        label: "Women's",
        items: [
          { slug: "tops", label: "Tops" },
          { slug: "dresses", label: "Dresses" },
          { slug: "pants", label: "Pants" },
          { slug: "outerwear", label: "Outerwear" },
        ],
      },
    ],
    promo: {
      image: images.menuClothing,
      title: "The linen edit",
      text: "Breathable layers for every season.",
      href: "/collections/clothing/new-arrivals",
    },
    filters: { size: true },
  },
  {
    slug: "makeup",
    label: "Makeup",
    description: "Clean, vegan, cruelty-free makeup for an easy, natural look in under five minutes.",
    banner: images.bannerMakeup,
    groups: [
      {
        label: "Makeup",
        items: [
          { slug: "face", label: "Face" },
          { slug: "eyes", label: "Eyes" },
          { slug: "lips", label: "Lips" },
          { slug: "nails", label: "Nails" },
        ],
      },
      {
        label: "Tools & Gifts",
        items: [
          { slug: "tools", label: "Tools & Brushes" },
          { slug: "sets", label: "Sets & Gifts" },
        ],
      },
    ],
    promo: {
      image: images.menuMakeup,
      title: "Skin, but better",
      text: "Meet the Skin Tint Serum in 10 shades.",
      href: "/products/skin-tint-serum",
    },
    filters: { size: false },
  },
  {
    slug: "jute-bags",
    label: "Jute Bags",
    description: "Handwoven from golden jute: strong, biodegradable and made to carry you for years.",
    banner: images.bannerJute,
    groups: [
      {
        label: "Bags",
        items: [
          { slug: "totes", label: "Totes" },
          { slug: "shopping-bags", label: "Shopping Bags" },
          { slug: "backpacks", label: "Backpacks" },
          { slug: "crossbodies", label: "Crossbodies" },
        ],
      },
      {
        label: "Accessories",
        items: [{ slug: "pouches", label: "Pouches & Accessories" }],
      },
    ],
    promo: {
      image: images.menuJute,
      title: "The Market Tote",
      text: "Our signature bag, woven by hand.",
      href: "/products/market-jute-tote",
    },
    filters: { size: false },
  },
];

/** "Featured" links shown in every category's mega menu. */
export const featuredCollections = [
  { slug: "new-arrivals", label: "New Arrivals" },
  { slug: "best-sellers", label: "Best Sellers" },
  { slug: "sale", label: "Sale" },
] as const;

/** Simple top-level links that sit after the category menus. */
export const extraNavLinks = [
  { label: "Sale", href: "/collections/sale", highlight: true },
  { label: "About", href: "/about", highlight: false },
];

export const footerLinks = {
  Company: [
    { label: "About Daymark", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Best Sellers", href: "/collections/best-sellers" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns & exchanges", href: "/returns" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
};

export function subcategoryPath(group: CategoryGroup, item: SubCategory): string {
  return group.slug ? `${group.slug}/${item.slug}` : item.slug;
}
