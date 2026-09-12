import { ProductCard } from "@/components/product/product-card";
import type { ProductWithRelations } from "@/lib/data";

export function ProductGrid({ products }: { products: ProductWithRelations[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border py-24 text-center">
        <p className="text-muted-foreground">No products match your filters just yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
