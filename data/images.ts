/**
 * Every non-product image on the site (banners, menu tiles, About page…).
 * Product photos are worked out from data/products.ts.
 *
 * To replace a placeholder with a real photo, save the photo at the same
 * path inside /public (same file name, .jpg). Nothing else needs to change.
 * Run `npm run images` to rebuild IMAGES.md and fill in any missing placeholders.
 */

export interface SiteImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  usage: string;
}

function img(src: string, width: number, height: number, alt: string, usage: string): SiteImage {
  return { src, width, height, alt, usage };
}

export const images = {
  // Home page
  heroHome: img("/images/banners/hero-home.jpg", 2400, 1200, "Daymark jute tote, linen top and lipstick styled in morning light", "Home page: full-width hero banner at the top"),
  categoryClothing: img("/images/banners/category-clothing.jpg", 1200, 1500, "Daymark clothing", "Home page: 'Shop by category' tile, Clothing"),
  categoryMakeup: img("/images/banners/category-makeup.jpg", 1200, 1500, "Daymark makeup", "Home page: 'Shop by category' tile, Makeup"),
  categoryJute: img("/images/banners/category-jute-bags.jpg", 1200, 1500, "Daymark jute bags", "Home page: 'Shop by category' tile, Jute Bags"),
  featureJute: img("/images/banners/feature-jute.jpg", 2400, 1000, "Close-up of handwoven golden jute fibre", "Home page: full-width feature banner ('The golden fibre')"),
  featureMakeup: img("/images/banners/feature-makeup.jpg", 1600, 1600, "Daymark skin tint and lipsticks on a stone surface", "Home page: image-with-text section, Makeup (image left)"),
  featureClothing: img("/images/banners/feature-clothing.jpg", 1600, 1600, "Model wearing the Linen Boxy Top and Wide-Leg Linen Trouser", "Home page: image-with-text section, Clothing (image right)"),
  featureSale: img("/images/banners/feature-sale.jpg", 2400, 1000, "Daymark seasonal sale", "Home page: full-width feature banner (Sale)"),

  // Collection page banners (sub-collections reuse their parent's banner)
  bannerClothing: img("/images/banners/banner-clothing.jpg", 2400, 800, "Daymark clothing collection", "Clothing collection pages: top banner"),
  bannerMakeup: img("/images/banners/banner-makeup.jpg", 2400, 800, "Daymark makeup collection", "Makeup collection pages: top banner"),
  bannerJute: img("/images/banners/banner-jute-bags.jpg", 2400, 800, "Daymark jute bag collection", "Jute Bags collection pages: top banner"),
  bannerSale: img("/images/banners/banner-sale.jpg", 2400, 800, "Daymark sale", "Sale, New Arrivals and Best Sellers pages: top banner"),

  // Mega menu promo tiles (desktop)
  menuClothing: img("/images/promos/menu-clothing.jpg", 800, 1000, "New season clothing", "Desktop menu: promo tile in the Clothing dropdown"),
  menuMakeup: img("/images/promos/menu-makeup.jpg", 800, 1000, "Everyday makeup essentials", "Desktop menu: promo tile in the Makeup dropdown"),
  menuJute: img("/images/promos/menu-jute-bags.jpg", 800, 1000, "Handwoven jute totes", "Desktop menu: promo tile in the Jute Bags dropdown"),

  // About page
  aboutHero: img("/images/about/about-hero.jpg", 2400, 1200, "Artisans weaving jute in the Daymark workshop", "About page: hero banner"),
  aboutJute: img("/images/about/about-jute.jpg", 1600, 1600, "Bundles of raw golden jute fibre", "About page: 'Why jute' image-with-text"),
  aboutCraft: img("/images/about/about-craft.jpg", 1600, 1600, "Hands stitching a leather handle onto a jute tote", "About page: 'Craftsmanship' image-with-text"),

  // Social sharing
  ogDefault: img("/images/og/og-default.jpg", 1200, 630, "Daymark: everyday essentials, made to last", "Link previews on social media and messaging apps (Open Graph)"),
} satisfies Record<string, SiteImage>;
