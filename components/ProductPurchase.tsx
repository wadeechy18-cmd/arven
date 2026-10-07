"use client";

import { useState } from "react";
import { swatchLabel, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { QuantityStepper } from "./QuantityStepper";

/** Variant pickers (colour/shade, size), quantity and Add to cart. */
export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const swatches = product.swatches ?? [];
  const sizes = product.sizes ?? [];
  const [swatch, setSwatch] = useState(swatches[0]?.name);
  const [size, setSize] = useState<string | undefined>(sizes.length === 1 ? sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const label = swatchLabel(product);

  const onAdd = () => {
    if (sizes.length > 0 && !size) {
      setSizeError(true);
      document.getElementById("size-picker")?.focus();
      return;
    }
    addItem({ slug: product.slug, swatch, size }, qty);
    setQty(1);
  };

  return (
    <div className="space-y-6">
      {swatches.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm">
            <span className="font-semibold">{label}:</span> {swatch}
          </legend>
          <div className="flex flex-wrap gap-2">
            {swatches.map((s) => {
              const on = s.name === swatch;
              return (
                <label
                  key={s.name}
                  title={s.name}
                  className={`grid size-12 cursor-pointer place-items-center rounded-full border-2 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    on ? "border-ink" : "border-transparent hover:border-line"
                  }`}
                >
                  <input
                    type="radio"
                    name="swatch"
                    value={s.name}
                    checked={on}
                    onChange={() => setSwatch(s.name)}
                    className="sr-only"
                  />
                  <span className="size-9 rounded-full border border-ink/15" style={{ backgroundColor: s.hex }} />
                  <span className="sr-only">{s.name}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {sizes.length > 0 && (
        <fieldset id="size-picker" tabIndex={-1} aria-describedby={sizeError ? "size-error" : undefined} className="outline-none">
          <legend className="mb-3 flex w-full justify-between text-sm">
            <span>
              <span className="font-semibold">Size:</span> {size ?? "Select a size"}
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const on = s === size;
              return (
                <label
                  key={s}
                  className={`grid min-h-12 min-w-14 cursor-pointer place-items-center rounded-md border px-3 text-sm font-medium transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                    on ? "border-ink bg-ink text-canvas" : "border-line bg-surface hover:border-ink"
                  }`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={on}
                    onChange={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    className="sr-only"
                  />
                  {s}
                </label>
              );
            })}
          </div>
          {sizeError && (
            <p id="size-error" role="alert" className="mt-2 text-sm text-sale">
              Please choose a size.
            </p>
          )}
        </fieldset>
      )}

      <div className="flex gap-3">
        <QuantityStepper value={qty} onChange={setQty} label="Quantity" />
        <button type="button" onClick={onAdd} className="btn-primary flex-1">
          Add to cart
        </button>
      </div>
    </div>
  );
}
