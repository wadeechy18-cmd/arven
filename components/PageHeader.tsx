import type { ReactNode } from "react";

/** Simple title block for text pages (FAQ, policies, contact…). */
export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="border-b border-line bg-sand/60">
      <div className="container-page py-12 sm:py-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-muted sm:text-lg">{children}</div>}
      </div>
    </div>
  );
}
