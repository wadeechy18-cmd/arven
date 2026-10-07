"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { Drawer } from "./Drawer";
import { CloseIcon, FilterIcon } from "./Icons";
import { ProductCard } from "./ProductCard";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const PRICE_RANGES = [
  { id: "0-25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 – $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 – $200", min: 100, max: 200 },
  { id: "200+", label: "$200 and over", min: 200, max: Infinity },
];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

export interface CategoryFacet {
  /** Which product field the "Category" filter looks at. */
  key: "category" | "subcategory";
  options: { value: string; label: string }[];
}

interface Filters {
  category: string[];
  price: string[];
  colour: string[];
  size: string[];
}

const EMPTY: Filters = { category: [], price: [], colour: [], size: [] };

export function CollectionView({
  products,
  categoryFacet,
  showSize,
  colourLabel,
}: {
  products: Product[];
  categoryFacet: CategoryFacet;
  showSize: boolean;
  colourLabel: string;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState<SortKey>("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Only offer options that at least one product in this collection has.
  const colours = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) for (const s of p.swatches ?? []) if (!map.has(s.name)) map.set(s.name, s.hex);
    return [...map].map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const sizes = useMemo(() => {
    const set = new Set(products.flatMap((p) => p.sizes ?? []));
    return [...set].sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a);
      const ib = SIZE_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      return a.localeCompare(b, undefined, { numeric: true });
    });
  }, [products]);

  const priceRanges = PRICE_RANGES.filter((r) => products.some((p) => p.price >= r.min && p.price < r.max));
  const categoryOptions = categoryFacet.options.filter((o) => products.some((p) => p[categoryFacet.key] === o.value));

  const visible = useMemo(() => {
    const list = products.filter((p) => {
      if (filters.category.length && !filters.category.includes(p[categoryFacet.key])) return false;
      if (
        filters.price.length &&
        !filters.price.some((id) => {
          const r = PRICE_RANGES.find((x) => x.id === id)!;
          return p.price >= r.min && p.price < r.max;
        })
      )
        return false;
      if (filters.colour.length && !(p.swatches ?? []).some((s) => filters.colour.includes(s.name))) return false;
      if (filters.size.length && !(p.sizes ?? []).some((s) => filters.size.includes(s))) return false;
      return true;
    });
    if (sort === "newest") list.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "featured") list.sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller));
    return list;
  }, [products, filters, sort, categoryFacet.key]);

  const toggle = (group: keyof Filters, value: string) =>
    setFilters((f) => ({
      ...f,
      [group]: f[group].includes(value) ? f[group].filter((v) => v !== value) : [...f[group], value],
    }));

  const activeCount = Object.values(filters).reduce((n, arr) => n + arr.length, 0);

  const activeChips = [
    ...filters.category.map((v) => ({ group: "category" as const, value: v, label: categoryOptions.find((o) => o.value === v)?.label ?? v })),
    ...filters.price.map((v) => ({ group: "price" as const, value: v, label: PRICE_RANGES.find((r) => r.id === v)?.label ?? v })),
    ...filters.colour.map((v) => ({ group: "colour" as const, value: v, label: v })),
    ...filters.size.map((v) => ({ group: "size" as const, value: v, label: `Size ${v}` })),
  ];

  const filterPanel = (idPrefix: string) => (
    <div className="divide-y divide-line">
      {categoryOptions.length > 1 && (
        <FacetGroup title="Category">
          {categoryOptions.map((o) => (
            <Check
              key={o.value}
              id={`${idPrefix}-cat-${o.value}`}
              label={o.label}
              checked={filters.category.includes(o.value)}
              onChange={() => toggle("category", o.value)}
            />
          ))}
        </FacetGroup>
      )}
      {priceRanges.length > 1 && (
        <FacetGroup title="Price">
          {priceRanges.map((r) => (
            <Check
              key={r.id}
              id={`${idPrefix}-price-${r.id}`}
              label={r.label}
              checked={filters.price.includes(r.id)}
              onChange={() => toggle("price", r.id)}
            />
          ))}
        </FacetGroup>
      )}
      {colours.length > 1 && (
        <FacetGroup title={colourLabel}>
          <div className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
            {colours.map((c) => (
              <Check
                key={c.name}
                id={`${idPrefix}-col-${c.name}`}
                label={c.name}
                swatch={c.hex}
                checked={filters.colour.includes(c.name)}
                onChange={() => toggle("colour", c.name)}
              />
            ))}
          </div>
        </FacetGroup>
      )}
      {showSize && sizes.length > 0 && (
        <FacetGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const on = filters.size.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle("size", s)}
                  className={`min-h-11 min-w-12 rounded-md border px-3 text-sm ${on ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink"}`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FacetGroup>
      )}
    </div>
  );

  return (
    <div className="container-page">
      {/* Toolbar */}
      <div className="sticky top-16 z-20 -mx-4 flex items-center justify-between gap-3 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-6 lg:backdrop-blur-none">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium lg:hidden"
        >
          <FilterIcon size={18} /> Filter {activeCount > 0 && `(${activeCount})`}
        </button>
        <p className="hidden text-sm text-muted lg:block" aria-live="polite">
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="hidden text-sm text-muted sm:block">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="min-h-11 rounded-full border border-line bg-surface px-4 pr-8 text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          {filterPanel("desk")}
          {activeCount > 0 && (
            <button type="button" onClick={() => setFilters(EMPTY)} className="mt-4 text-sm link-underline">
              Clear all filters
            </button>
          )}
        </aside>

        <div>
          {activeChips.length > 0 && (
            <ul className="mb-6 mt-4 flex flex-wrap gap-2 lg:mt-0" aria-label="Active filters">
              {activeChips.map((chip) => (
                <li key={chip.group + chip.value}>
                  <button
                    type="button"
                    onClick={() => toggle(chip.group, chip.value)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-sand px-3 text-sm hover:bg-jute-soft"
                  >
                    {chip.label}
                    <CloseIcon size={14} />
                    <span className="sr-only">Remove filter</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mb-4 mt-4 text-sm text-muted lg:hidden" aria-live="polite">
            {visible.length} {visible.length === 1 ? "product" : "products"}
          </p>
          {visible.length === 0 ? (
            <div className="rounded-md border border-dashed border-line py-16 text-center">
              <p className="font-medium">No products match those filters.</p>
              <button type="button" onClick={() => setFilters(EMPTY)} className="btn-secondary mt-4">
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {visible.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} sizes="(min-width: 1024px) 26vw, (min-width: 768px) 33vw, 50vw" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" label="Filters">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="text-lg font-semibold">Filter</h2>
          <button type="button" onClick={() => setDrawerOpen(false)} className="-mr-3 grid size-12 place-items-center" aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">{filterPanel("mob")}</div>
        <div className="grid grid-cols-2 gap-3 border-t border-line p-5">
          <button type="button" onClick={() => setFilters(EMPTY)} className="btn-secondary px-4">
            Clear all
          </button>
          <button type="button" onClick={() => setDrawerOpen(false)} className="btn-primary px-4">
            Show {visible.length}
          </button>
        </div>
      </Drawer>
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="py-5">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function Check({
  id,
  label,
  checked,
  onChange,
  swatch,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="size-5 accent-ink" />
      {swatch && <span className="size-5 rounded-full border border-ink/15" style={{ backgroundColor: swatch }} aria-hidden="true" />}
      {label}
    </label>
  );
}
