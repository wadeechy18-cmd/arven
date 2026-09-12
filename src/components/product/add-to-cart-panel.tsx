"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useUIStore } from "@/lib/ui-store";
import { cn, formatPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/lib/data";

export function AddToCartPanel({ product }: { product: ProductWithRelations }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const variantGroups = useMemo(() => {
    const map = new Map<string, typeof product.variants>();
    for (const v of product.variants) {
      const list = map.get(v.name) ?? [];
      list.push(v);
      map.set(v.name, list);
    }
    return Array.from(map.entries());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.variants]);

  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const unitPrice = product.price + (selectedVariant?.priceDelta ?? 0);
  const outOfStock = stock <= 0;

  function buildCartItem() {
    return {
      key: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "/placeholders/texture-jute-01.svg",
      unitPrice,
      variantLabel: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
      maxStock: stock,
    };
  }

  function handleAddToCart() {
    addItem(buildCartItem(), quantity);
    setJustAdded(true);
    setCartOpen(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(buildCartItem(), quantity);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-8">
      {variantGroups.map(([groupName, variants]) => (
        <div key={groupName}>
          <p className="eyebrow mb-3">{groupName}</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                aria-pressed={selectedVariantId === v.id}
                aria-label={v.value}
                className={cn(
                  "flex h-11 items-center gap-2 border px-4 text-sm transition-colors",
                  selectedVariantId === v.id
                    ? "border-primary text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/40",
                )}
              >
                {v.swatchHex && (
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-border"
                    style={{ backgroundColor: v.swatchHex }}
                  />
                )}
                {v.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <p className="eyebrow mb-3">Quantity</p>
        <div className="flex w-fit items-center border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-foreground"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
            className="flex h-11 w-11 items-center justify-center text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={handleAddToCart} disabled={outOfStock}>
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added to Cart
            </>
          ) : outOfStock ? (
            "Out of Stock"
          ) : (
            `Add to Cart — ${formatPrice(unitPrice * quantity)}`
          )}
        </Button>
        <Button size="lg" variant="outline" onClick={handleBuyNow} disabled={outOfStock}>
          Buy Now
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {outOfStock
          ? "Currently out of stock — check back soon."
          : stock <= 5
            ? `Only ${stock} left in stock.`
            : "In stock, ready to ship."}
      </p>
    </div>
  );
}
