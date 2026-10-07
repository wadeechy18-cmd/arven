import Link from "next/link";
import { ProductCarousel } from "@/components/ProductCarousel";
import { products } from "@/data/products";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">We can&apos;t find that page</h1>
        <p className="mt-4 max-w-md text-muted">
          It may have moved or no longer exists. Try searching, or head back to the shop.
        </p>
        <form action="/search" role="search" className="mt-8 flex w-full max-w-md gap-2">
          <label htmlFor="nf-search" className="sr-only">
            Search products
          </label>
          <input id="nf-search" name="q" type="search" placeholder="Search products" className="input rounded-full" />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-secondary">
            Home
          </Link>
          <Link href="/collections/new-arrivals" className="btn-secondary">
            New arrivals
          </Link>
        </div>
      </div>
      <ProductCarousel title="Shop best sellers" products={products.filter((p) => p.bestSeller)} />
    </>
  );
}
