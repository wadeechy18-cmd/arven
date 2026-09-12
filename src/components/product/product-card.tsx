"use client";

import Image from "@/components/ui/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import type { ProductWithRelations } from "@/lib/data";

export function ProductCard({
  product,
  className,
}: {
  product: ProductWithRelations;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    const variant = product.variants[0];
    addItem({
      key: variant ? `${product.id}-${variant.id}` : product.id,
      productId: product.id,
      variantId: variant?.id,
      slug: product.slug,
      name: product.name,
      image: primaryImage?.url ?? "/placeholders/texture-jute-01.svg",
      unitPrice: product.price + (variant?.priceDelta ?? 0),
      variantLabel: variant ? `${variant.name}: ${variant.value}` : undefined,
      maxStock: variant ? variant.stock : product.stock,
    });
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("group flex flex-col", className)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              secondaryImage && "group-hover:opacity-0",
            )}
          />
        )}
        {secondaryImage && (
          <Image
            src={secondaryImage.url}
            alt={secondaryImage.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 90vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && <Badge variant="sale">Sale</Badge>}
          {product.isNewArrival && <Badge variant="accent">New</Badge>}
        </div>

        <button
          type="button"
          onClick={quickAdd}
          className="absolute inset-x-3 bottom-3 translate-y-2 bg-primary py-2.5 text-center text-xs font-medium uppercase tracking-wide text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick Add
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-jute text-jute" />
          <span>{product.rating.toFixed(1)}</span>
          <span>·</span>
          <span>{product.reviewCount} reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
