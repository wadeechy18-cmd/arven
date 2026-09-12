import type { Metadata } from "next";

import { getCategories, getProducts } from "@/lib/data";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductGrid } from "@/components/product/product-grid";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse jute bags, leather wallets, and natural-material accessories.",
};

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    min?: string;
    max?: string;
    filter?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: searchParams.category,
      search: searchParams.search,
      sort: searchParams.sort as never,
      minPrice: searchParams.min ? Number(searchParams.min) * 100 : undefined,
      maxPrice: searchParams.max ? Number(searchParams.max) * 100 : undefined,
      bestSellersOnly: searchParams.filter === "best-sellers",
      newArrivalsOnly: searchParams.filter === "new-arrivals",
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === searchParams.category);

  return (
    <div className="container-wide section-y !pt-10">
      <div className="mb-10">
        <p className="eyebrow mb-3">Shop</p>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          {searchParams.search
            ? `Results for “${searchParams.search}”`
            : searchParams.filter === "best-sellers"
              ? "Best Sellers"
              : searchParams.filter === "new-arrivals"
                ? "New Arrivals"
                : activeCategory?.name ?? "All Products"}
        </h1>
        {activeCategory?.description && (
          <p className="mt-3 max-w-xl text-muted-foreground">{activeCategory.description}</p>
        )}
      </div>

      <ShopFilters categories={categories} />
      <p className="mb-6 text-sm text-muted-foreground">
        {products.length} product{products.length === 1 ? "" : "s"}
      </p>
      <ProductGrid products={products} />
    </div>
  );
}
