import { trustPoints } from "@/data/site";
import { LeafIcon, ReturnIcon, TruckIcon } from "./Icons";

const icons = { truck: TruckIcon, return: ReturnIcon, leaf: LeafIcon };

export function TrustStrip({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`grid gap-4 ${compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3 sm:gap-8"}`}>
      {trustPoints.map((t) => {
        const Icon = icons[t.icon];
        return (
          <li key={t.title} className={`flex items-center gap-3 ${compact ? "" : "sm:flex-col sm:text-center"}`}>
            <Icon size={compact ? 22 : 28} className="shrink-0 text-accent" />
            <p className="text-sm">
              <span className="font-semibold">{t.title}</span>
              <span className={compact ? " text-muted" : " block text-muted"}>
                {compact ? " · " : ""}
                {t.text}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
