import Link from "next/link";

import { getBestSellers } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

export async function BestSellers() {
  const products = await getBestSellers(4);
  if (products.length === 0) return null;

  return (
    <section className="section-y bg-secondary/30">
      <div className="container-wide">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-lg">
            <p className="eyebrow mb-3">Customer Favourites</p>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">Best Sellers</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/shop?filter=best-sellers">View All</Link>
          </Button>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
