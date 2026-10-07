"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories, extraNavLinks, featuredCollections, subcategoryPath } from "@/data/navigation";
import { site } from "@/data/site";
import { Drawer } from "./Drawer";
import { ChevronLeft, ChevronRight, CloseIcon, MailIcon, UserIcon } from "./Icons";
import { Logo } from "./Logo";

/**
 * Panels are identified by a path: "" (top level), "clothing", "clothing/mens".
 * "Back" pops one level off.
 */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [panel, setPanel] = useState("");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const headerRef = useRef<HTMLDivElement>(null);

  // After moving between panels, put keyboard focus on the Back button.
  useEffect(() => {
    if (panel) headerRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [panel]);

  const go = (next: string) => {
    setDirection("forward");
    setPanel(next);
  };
  const back = () => {
    setDirection("back");
    setPanel((p) => p.split("/").slice(0, -1).join("/"));
  };
  const close = () => {
    onClose();
    setPanel("");
  };

  const [catSlug, groupSlug] = panel ? panel.split("/") : [];
  const cat = categories.find((c) => c.slug === catSlug);
  const group = cat?.groups.find((g) => g.slug === groupSlug);

  const rowClass = "flex min-h-14 w-full items-center justify-between border-b border-line px-5 text-left text-base";

  let title = "Menu";
  let body: React.ReactNode;

  if (cat && group) {
    title = `${group.label} ${cat.label}`;
    const base = `/collections/${cat.slug}`;
    body = (
      <ul>
        <li>
          <Link href={`${base}/${group.slug}`} className={`${rowClass} font-semibold`} onClick={close}>
            Shop all {group.label}
          </Link>
        </li>
        {group.items.map((item) => (
          <li key={item.slug}>
            <Link href={`${base}/${subcategoryPath(group, item)}`} className={rowClass} onClick={close}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  } else if (cat) {
    title = cat.label;
    const base = `/collections/${cat.slug}`;
    body = (
      <>
        <ul>
          <li>
            <Link href={base} className={`${rowClass} font-semibold`} onClick={close}>
              Shop all {cat.label}
            </Link>
          </li>
          {cat.groups.map((g) =>
            g.slug ? (
              <li key={g.label}>
                <button type="button" className={rowClass} onClick={() => go(`${cat.slug}/${g.slug}`)}>
                  {g.label}
                  <ChevronRight size={18} />
                </button>
              </li>
            ) : (
              g.items.map((item) => (
                <li key={item.slug}>
                  <Link href={`${base}/${subcategoryPath(g, item)}`} className={rowClass} onClick={close}>
                    {item.label}
                  </Link>
                </li>
              ))
            ),
          )}
        </ul>
        <p className="eyebrow px-5 pb-2 pt-6">Featured</p>
        <ul>
          {featuredCollections.map((f) => (
            <li key={f.slug}>
              <Link
                href={`${base}/${f.slug}`}
                className={`${rowClass} ${f.slug === "sale" ? "text-sale" : ""}`}
                onClick={close}
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    body = (
      <>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <button type="button" className={`${rowClass} font-medium`} onClick={() => go(c.slug)}>
                {c.label}
                <ChevronRight size={18} />
              </button>
            </li>
          ))}
          {extraNavLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`${rowClass} font-medium ${l.highlight ? "text-sale" : ""}`} onClick={close}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-6 space-y-1 px-5 text-sm">
          <li>
            <Link href="/account" className="flex min-h-12 items-center gap-3" onClick={close}>
              <UserIcon size={20} /> Account
            </Link>
          </li>
          <li>
            <Link href="/contact" className="flex min-h-12 items-center gap-3" onClick={close}>
              <MailIcon size={20} /> Contact us
            </Link>
          </li>
          <li>
            <Link href="/faq" className="flex min-h-12 items-center gap-3" onClick={close}>
              <span className="w-5" aria-hidden="true" /> Help &amp; FAQ
            </Link>
          </li>
        </ul>
        <p className="mt-auto px-5 py-6 text-xs text-muted">
          Shipping to Canada · {site.currency} $
        </p>
      </>
    );
  }

  return (
    <Drawer open={open} onClose={close} side="left" label="Site menu">
      <div ref={headerRef} className="flex h-16 shrink-0 items-center justify-between border-b border-line px-2">
        {panel ? (
          <button type="button" onClick={back} className="flex min-h-12 items-center gap-1 px-3 text-sm font-medium">
            <ChevronLeft size={18} /> Back
          </button>
        ) : (
          <Logo className="inline-flex px-3" />
        )}
        <button type="button" onClick={close} className="grid size-12 place-items-center" aria-label="Close menu">
          <CloseIcon />
        </button>
      </div>
      <div
        key={panel}
        className={`flex flex-1 flex-col overflow-y-auto ${direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"}`}
      >
        {panel && <h2 className="px-5 pb-2 pt-5 text-lg font-semibold">{title}</h2>}
        {body}
      </div>
    </Drawer>
  );
}
