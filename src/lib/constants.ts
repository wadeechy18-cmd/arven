export const SITE_NAME = "Arven";
export const SITE_TAGLINE = "Natural materials, made to last.";
// `||` (not `??`) on purpose: Vercel env vars left blank in the dashboard
// come through as "" rather than undefined, and `??` wouldn't fall back.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL || "hello@arven.co";
export const STORE_PHONE = process.env.NEXT_PUBLIC_STORE_PHONE || "+1 (555) 010-2938";
export const STORE_ADDRESS = "142 Foundry Lane, Portland, OR 97209";
export const FREE_SHIPPING_THRESHOLD = 10000; // cents

export const MAIN_NAV = [
  { label: "Shop All", href: "/shop" },
  { label: "Jute Bags", href: "/shop?category=jute-bags" },
  { label: "Leather Wallets", href: "/shop?category=leather-wallets" },
  { label: "Accessories", href: "/shop?category=accessories" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Jute Bags", href: "/shop?category=jute-bags" },
    { label: "Leather Wallets", href: "/shop?category=leather-wallets" },
    { label: "Best Sellers", href: "/shop?filter=best-sellers" },
    { label: "New Arrivals", href: "/shop?filter=new-arrivals" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Support: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "Facebook", href: "https://facebook.com" },
];
