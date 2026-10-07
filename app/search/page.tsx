import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { popularSearches, searchProducts } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Daymark clothing, makeup and jute bags.",
  robots: { index: false },
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 100);
  const results = q ? searchProducts(q) : [];

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="text-3xl font-semibold sm:text-4xl">{q ? <>Results for “{q}”</> : "Search"}</h1>
      <form action="/search" role="search" className="mt-6 flex max-w-xl items-center gap-2 rounded-full border border-line bg-surface p-1 pl-4">
        <SearchIcon size={20} className="text-muted" />
        <label htmlFor="search-page-input" className="sr-only">
          Search products
        </label>
        <input
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search products"
          className="min-h-11 flex-1 bg-transparent text-base outline-none"
        />
        <button type="submit" className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-canvas">
          Search
        </button>
      </form>

      {q && (
        <p className="mt-6 text-sm text-muted" role="status">
          {results.length} {results.length === 1 ? "product" : "products"} found
        </p>
      )}

      {q && results.length === 0 && (
        <div className="mt-6">
          <p>Nothing matched. Try one of these:</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {popularSearches.map((t) => (
              <li key={t}>
                <Link href={`/search?q=${encodeURIComponent(t)}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-ink">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {results.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
