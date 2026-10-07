"use client";

import Image from "next/image";
import Link from "next/link";
import { productImages, swatchLabel } from "@/data/products";
import { useCart, type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { QuantityStepper } from "./QuantityStepper";

export function CartLineItem({ line, onNavigate, large = false }: { line: CartLine; onNavigate?: () => void; large?: boolean }) {
  const { updateQuantity, removeItem } = useCart();
  const p = line.product;
  const href = `/products/${p.slug}`;
  return (
    <li className="flex gap-4 py-5">
      <Link href={href} onClick={onNavigate} className={`relative shrink-0 overflow-hidden bg-sand ${large ? "h-40 w-32" : "h-28 w-[5.6rem]"}`}>
        <Image src={productImages(p)[0]} alt={p.name} fill sizes="128px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link href={href} onClick={onNavigate} className="font-medium hover:underline underline-offset-4">
              {p.name}
            </Link>
            <p className="mt-0.5 text-sm text-muted">
              {[line.swatch && `${swatchLabel(p)}: ${line.swatch}`, line.size && `Size: ${line.size}`].filter(Boolean).join(" · ")}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium">{formatPrice(line.lineTotal)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            onChange={(n) => updateQuantity(line.id, n)}
            label={`Quantity for ${p.name}`}
          />
          <button type="button" onClick={() => removeItem(line.id)} className="min-h-10 px-1 text-sm text-muted link-underline hover:text-ink">
            Remove<span className="sr-only"> {p.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
}
