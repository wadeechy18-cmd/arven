"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useState } from "react";
import { productImages } from "@/data/products";
import { categoryLabel } from "@/lib/collections";
import { popularSearches, searchProducts } from "@/lib/search";
import { Drawer } from "./Drawer";
import { CloseIcon, SearchIcon } from "./Icons";
import { Price } from "./Price";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const router = useRouter();
  const results = searchProducts(deferred, 6);
  const trimmed = deferred.trim();

  const close = () => {
    onClose();
    setQuery("");
  };

  return (
    <Drawer open={open} onClose={close} side="top" label="Search">
      <div className="container-page py-4 sm:py-6">
        <form
          role="search"
          className="flex items-center gap-2 border-b-2 border-ink"
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            close();
          }}
        >
          <SearchIcon className="shrink-0 text-muted" />
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            type="search"
            autoFocus
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              // Browsers use Escape to clear search fields; close the overlay instead.
              if (e.key === "Escape") {
                e.preventDefault();
                close();
              }
            }}
            placeholder="Search totes, linen, lipstick…"
            className="min-h-14 flex-1 bg-transparent text-lg outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={close} className="grid size-12 place-items-center" aria-label="Close search">
            <CloseIcon />
          </button>
        </form>

        <div className="max-h-[65vh] overflow-y-auto py-6" aria-live="polite">
          {!trimmed && (
            <div>
              <p className="eyebrow mb-3">Popular searches</p>
              <ul className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => setQuery(term)}
                      className="min-h-11 rounded-full border border-line px-4 text-sm hover:border-ink"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {trimmed && results.length === 0 && (
            <p className="text-muted">
              No products match “{trimmed}”. Try another word, or{" "}
              <Link href="/collections/best-sellers" className="link-underline text-ink" onClick={close}>
                browse our best sellers
              </Link>
              .
            </p>
          )}

          {results.length > 0 && (
            <>
              <p className="eyebrow mb-4">Products</p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} onClick={close} className="group block">
                      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                        <Image
                          src={productImages(p)[0]}
                          alt={p.name}
                          fill
                          sizes="(min-width: 1024px) 15vw, 45vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted">{categoryLabel(p)}</p>
                      <p className="text-sm font-medium">{p.name}</p>
                      <Price product={p} className="text-sm" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(trimmed)}`}
                onClick={close}
                className="btn-secondary mt-8"
              >
                View all results
              </Link>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
