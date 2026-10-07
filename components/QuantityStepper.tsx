"use client";

import { MAX_QTY } from "@/lib/cart";
import { MinusIcon, PlusIcon } from "./Icons";

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "size-10" : "size-12";
  return (
    <div className="inline-flex items-center rounded-full border border-line" role="group" aria-label={label}>
      <button
        type="button"
        className={`${btn} grid place-items-center disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon size={16} />
      </button>
      <span className="min-w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${btn} grid place-items-center disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
