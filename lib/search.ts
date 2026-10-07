import { products, type Product } from "@/data/products";
import { categoryLabel, subcategoryLabel } from "./collections";

function normalise(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

/** Simple ranked search across names, categories, colours/shades and descriptions. */
export function searchProducts(query: string, limit?: number): Product[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = products
    .map((p) => {
      const name = normalise(p.name);
      const cats = normalise(`${categoryLabel(p)} ${subcategoryLabel(p)} ${p.subcategory}`);
      const swatches = normalise((p.swatches ?? []).map((s) => s.name).join(" "));
      const text = normalise(`${p.shortDescription} ${p.description}`);
      let score = 0;
      for (const t of terms) {
        const stem = t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t;
        if (name.includes(stem)) score += name.split(" ").some((w) => w.startsWith(stem)) ? 10 : 6;
        else if (cats.includes(stem)) score += 5;
        else if (swatches.includes(stem)) score += 3;
        else if (text.includes(stem)) score += 1;
        else return { p, score: 0 }; // every term must match somewhere
      }
      if (p.bestSeller) score += 0.5;
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.p);

  return limit ? scored.slice(0, limit) : scored;
}

export const popularSearches = ["Tote", "Linen", "Lipstick", "Skin tint", "Backpack", "Tee"];
