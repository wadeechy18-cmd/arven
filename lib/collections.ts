import { categories, featuredCollections, subcategoryPath, type CategoryDef } from "@/data/navigation";
import { images, type SiteImage } from "@/data/images";
import { isOnSale, products, type Product } from "@/data/products";

export interface Crumb {
  label: string;
  href: string;
}

export interface Collection {
  path: string;
  title: string;
  description: string;
  banner: SiteImage;
  products: Product[];
  breadcrumbs: Crumb[];
  /** Quick links shown under the title (sub-collections). */
  chips: { label: string; href: string; active: boolean }[];
  /** Category this collection belongs to, if any. */
  category?: CategoryDef;
}

type FeaturedSlug = (typeof featuredCollections)[number]["slug"];

const featuredMeta: Record<FeaturedSlug, { title: string; description: string; match: (p: Product) => boolean }> = {
  "new-arrivals": {
    title: "New Arrivals",
    description: "Just landed: the latest from the Daymark studio.",
    match: (p) => !!p.isNew,
  },
  "best-sellers": {
    title: "Best Sellers",
    description: "The pieces our customers come back for, again and again.",
    match: (p) => !!p.bestSeller,
  },
  sale: {
    title: "Sale",
    description: "Limited-time prices on selected styles. While stock lasts.",
    match: isOnSale,
  },
};

function isFeatured(slug: string): slug is FeaturedSlug {
  return slug in featuredMeta;
}

const href = (path: string) => `/collections/${path}`;

function categoryChips(cat: CategoryDef, activePath: string) {
  const chips = [{ label: `All ${cat.label}`, href: href(cat.slug), active: activePath === cat.slug }];
  for (const group of cat.groups) {
    if (group.slug) {
      const p = `${cat.slug}/${group.slug}`;
      chips.push({ label: group.label, href: href(p), active: activePath === p });
    } else {
      for (const item of group.items) {
        const p = `${cat.slug}/${item.slug}`;
        chips.push({ label: item.label, href: href(p), active: activePath === p });
      }
    }
  }
  for (const f of featuredCollections) {
    const p = `${cat.slug}/${f.slug}`;
    chips.push({ label: f.label, href: href(p), active: activePath === p });
  }
  return chips;
}

function globalChips(activePath: string) {
  return [
    ...featuredCollections.map((f) => ({ label: f.label, href: href(f.slug), active: activePath === f.slug })),
    ...categories.map((c) => ({ label: c.label, href: href(c.slug), active: false })),
  ];
}

/** Turns a URL like /collections/clothing/mens/t-shirts into a collection, or undefined (404). */
export function resolveCollection(segments: string[]): Collection | undefined {
  const path = segments.join("/");
  const [first, ...rest] = segments;

  // Site-wide featured collections: /collections/sale etc.
  if (rest.length === 0 && isFeatured(first)) {
    const meta = featuredMeta[first];
    return {
      path,
      title: meta.title,
      description: meta.description,
      banner: images.bannerSale,
      products: products.filter(meta.match),
      breadcrumbs: [{ label: "Home", href: "/" }],
      chips: globalChips(path),
    };
  }

  const cat = categories.find((c) => c.slug === first);
  if (!cat) return undefined;
  const inCategory = products.filter((p) => p.category === cat.slug);
  const base = {
    path,
    banner: cat.banner,
    category: cat,
    chips: categoryChips(cat, path),
  };
  const catCrumb = { label: cat.label, href: href(cat.slug) };

  if (rest.length === 0) {
    return {
      ...base,
      title: cat.label,
      description: cat.description,
      products: inCategory,
      breadcrumbs: [{ label: "Home", href: "/" }],
    };
  }

  const sub = rest.join("/");

  if (rest.length === 1 && isFeatured(sub)) {
    const meta = featuredMeta[sub];
    return {
      ...base,
      title: `${cat.label}: ${meta.title}`,
      description: meta.description,
      products: inCategory.filter(meta.match),
      breadcrumbs: [{ label: "Home", href: "/" }, catCrumb],
    };
  }

  for (const group of cat.groups) {
    // Group level, e.g. /collections/clothing/mens
    if (group.slug && sub === group.slug) {
      return {
        ...base,
        title: `${group.label} ${cat.label}`,
        description: cat.description,
        products: inCategory.filter((p) => p.subcategory.startsWith(`${group.slug}/`)),
        breadcrumbs: [{ label: "Home", href: "/" }, catCrumb],
      };
    }
    for (const item of group.items) {
      if (subcategoryPath(group, item) === sub) {
        const crumbs = [{ label: "Home", href: "/" }, catCrumb];
        if (group.slug) crumbs.push({ label: group.label, href: href(`${cat.slug}/${group.slug}`) });
        return {
          ...base,
          title: group.slug ? `${group.label} ${item.label}` : item.label,
          description: cat.description,
          products: inCategory.filter((p) => p.subcategory === sub),
          breadcrumbs: crumbs,
          // Keep the group chip highlighted on its children.
          chips: base.chips.map((c) =>
            group.slug && c.href === href(`${cat.slug}/${group.slug}`) ? { ...c, active: true } : c,
          ),
        };
      }
    }
  }
  return undefined;
}

/** Every collection URL, for static generation and the sitemap. */
export function allCollectionPaths(): string[][] {
  const paths: string[][] = featuredCollections.map((f) => [f.slug]);
  for (const cat of categories) {
    paths.push([cat.slug]);
    for (const f of featuredCollections) paths.push([cat.slug, f.slug]);
    for (const group of cat.groups) {
      if (group.slug) paths.push([cat.slug, group.slug]);
      for (const item of group.items) paths.push([cat.slug, ...subcategoryPath(group, item).split("/")]);
    }
  }
  return paths;
}

/** Human label for a product's sub-category, e.g. "Women's Dresses" or "Lips". */
export function subcategoryLabel(p: Product): string {
  const cat = categories.find((c) => c.slug === p.category);
  if (!cat) return "";
  for (const group of cat.groups) {
    for (const item of group.items) {
      if (subcategoryPath(group, item) === p.subcategory) {
        return group.slug ? `${group.label} ${item.label}` : item.label;
      }
    }
  }
  return cat.label;
}

export function categoryLabel(p: Product): string {
  return categories.find((c) => c.slug === p.category)?.label ?? "";
}
