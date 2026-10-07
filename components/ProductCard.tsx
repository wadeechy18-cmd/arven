import Image from "next/image";
import Link from "next/link";
import { isOnSale, percentOff, productImages, swatchLabel, type Product } from "@/data/products";
import { categoryLabel } from "@/lib/collections";
import { Price } from "./Price";

const MAX_SWATCHES = 4;

export function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const [first, second] = productImages(product);
  const href = `/products/${product.slug}`;
  const swatches = product.swatches ?? [];
  const extra = swatches.length - MAX_SWATCHES;

  return (
    <article className="group relative flex flex-col">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-sand" tabIndex={-1} aria-hidden="true">
        <Image src={first} alt="" fill sizes={sizes} className="object-cover transition-opacity duration-500 group-hover:opacity-0" />
        {second && (
          <Image src={second} alt="" fill sizes={sizes} className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        )}
      </Link>

      <ul className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5" aria-label="Product labels">
        {isOnSale(product) && (
          <li className="rounded-full bg-sale px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-canvas">
            {percentOff(product)}% off
          </li>
        )}
        {product.isNew && (
          <li className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">New</li>
        )}
        {product.bestSeller && !product.isNew && !isOnSale(product) && (
          <li className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">Best seller</li>
        )}
      </ul>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.12em] text-muted">{categoryLabel(product)}</p>
        <h3 className="text-[15px] font-medium leading-snug">
          <Link href={href} className="after:absolute after:inset-0 hover:underline underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <Price product={product} className="text-[15px]" />
        {swatches.length > 1 && (
          <div className="mt-1 flex items-center gap-1.5">
            <ul className="flex gap-1.5" aria-label={`${swatches.length} ${swatchLabel(product).toLowerCase()}s available`}>
              {swatches.slice(0, MAX_SWATCHES).map((s) => (
                <li
                  key={s.name}
                  title={s.name}
                  className="size-4 rounded-full border border-ink/15 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.4)]"
                  style={{ backgroundColor: s.hex }}
                >
                  <span className="sr-only">{s.name}</span>
                </li>
              ))}
            </ul>
            {extra > 0 && (
              <Link href={href} className="relative z-10 text-xs text-muted hover:text-ink hover:underline" tabIndex={-1}>
                +{extra} more
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
