import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { allCollectionPaths } from "@/lib/collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/contact", "/faq", "/shipping", "/returns", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.5 })),
    ...allCollectionPaths().map((segs) => ({ url: `${site.url}/collections/${segs.join("/")}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
