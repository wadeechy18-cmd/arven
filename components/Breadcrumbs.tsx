import Link from "next/link";
import type { Crumb } from "@/lib/collections";

export function Breadcrumbs({ items, current, tone = "default" }: { items: Crumb[]; current: string; tone?: "default" | "light" }) {
  const light = tone === "light";
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${light ? "text-canvas/85" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c) => (
          <li key={c.href} className="flex items-center gap-2">
            <Link href={c.href} className={`hover:underline underline-offset-4 ${light ? "hover:text-canvas" : "hover:text-ink"}`}>
              {c.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className={light ? "text-canvas" : "text-ink"}>
          {current}
        </li>
      </ol>
    </nav>
  );
}
