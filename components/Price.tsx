import { isOnSale, percentOff, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";

/** Price, or sale price + struck-through original + "% off". */
export function Price({ product, className = "", showBadge = false }: { product: Product; className?: string; showBadge?: boolean }) {
  if (!isOnSale(product)) {
    return <p className={className}>{formatPrice(product.price)}</p>;
  }
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className="font-semibold text-sale">
        <span className="sr-only">Sale price </span>
        {formatPrice(product.price)}
      </span>
      <s className="text-muted">
        <span className="sr-only">Original price </span>
        {formatPrice(product.compareAtPrice!)}
      </s>
      {showBadge && <span className="text-xs font-semibold text-sale">{percentOff(product)}% off</span>}
    </p>
  );
}
