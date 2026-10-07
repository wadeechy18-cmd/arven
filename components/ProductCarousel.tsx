"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/data/products";
import { ChevronLeft, ChevronRight } from "./Icons";
import { ProductCard } from "./ProductCard";

/** Horizontal, swipeable row of product cards with arrow buttons on desktop. */
export function ProductCarousel({
  title,
  products,
  viewAllHref,
}: {
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (products.length === 0) return null;
  const headingId = `carousel-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section aria-labelledby={headingId} className="py-12 sm:py-16">
      <div className="container-page mb-6 flex items-end justify-between gap-4">
        <h2 id={headingId} className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link href={viewAllHref} className="mr-2 text-sm font-semibold link-underline">
              Shop all
            </Link>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="hidden size-11 place-items-center rounded-full border border-line hover:border-ink sm:grid"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="hidden size-11 place-items-center rounded-full border border-line hover:border-ink sm:grid"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 sm:scroll-px-6 sm:px-6 lg:gap-6 lg:scroll-px-10 lg:px-10 [max-width:1440px] mx-auto"
      >
        {products.map((p) => (
          <li key={p.slug} className="w-[70%] shrink-0 snap-start sm:w-[42%] md:w-[30%] lg:w-[calc((100%-3*1.5rem)/4)]">
            <ProductCard product={p} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 70vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
