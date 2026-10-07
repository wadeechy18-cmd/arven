"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories, extraNavLinks } from "@/data/navigation";
import { useCart } from "@/lib/cart";
import { BagIcon, ChevronDown, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { Logo } from "./Logo";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { SearchOverlay } from "./SearchOverlay";

const HOVER_DELAY_MS = 120;

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, ready, openCart } = useCart();
  const hoverTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  const scheduleOpen = (slug: string | null) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenMenu(slug), HOVER_DELAY_MS);
  };

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Escape closes the mega menu and puts focus back on its button.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${openMenu}"]`)?.focus();
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenu]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/90">
      <div className="relative" onMouseLeave={() => scheduleOpen(null)}>
        <div className="container-page grid h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center lg:h-[72px]">
          {/* Left: menu button (mobile) + logo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="-ml-3 grid size-12 place-items-center lg:hidden"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </button>
            <Logo className="hidden lg:inline-flex" />
          </div>

          {/* Centre: logo on mobile, main navigation on desktop */}
          <Logo className="inline-flex lg:hidden" />
          <nav
            ref={navRef}
            aria-label="Main"
            className="hidden lg:block"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
            }}
          >
            <ul className="flex items-center gap-1">
              {categories.map((cat) => {
                const isOpen = openMenu === cat.slug;
                const panelId = `mega-${cat.slug}`;
                return (
                  <li key={cat.slug} onMouseEnter={() => scheduleOpen(cat.slug)}>
                    <button
                      type="button"
                      data-menu={cat.slug}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        window.clearTimeout(hoverTimer.current);
                        setOpenMenu(isOpen ? null : cat.slug);
                      }}
                      className={`flex h-[72px] items-center gap-1 px-4 text-[15px] font-medium transition-colors ${
                        isOpen ? "text-ink shadow-[inset_0_-2px_0_var(--color-ink)]" : "text-ink/85 hover:text-ink"
                      }`}
                    >
                      {cat.label}
                      <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest("a")) setOpenMenu(null);
                        }}
                      >
                        <MegaMenuPanel category={cat} id={panelId} />
                      </div>
                    )}
                  </li>
                );
              })}
              {extraNavLinks.map((l) => (
                <li key={l.href} onMouseEnter={() => scheduleOpen(null)}>
                  <Link
                    href={l.href}
                    className={`flex h-[72px] items-center px-4 text-[15px] font-medium hover:underline underline-offset-4 ${
                      l.highlight ? "text-sale" : "text-ink/85 hover:text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: search, account, cart */}
          <div className="-mr-3 flex items-center justify-end">
            <button
              type="button"
              className="grid size-12 place-items-center"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <Link href="/account" className="hidden size-12 place-items-center sm:grid" aria-label="Account">
              <UserIcon />
            </Link>
            <button
              type="button"
              className="relative grid size-12 place-items-center"
              aria-label={`Cart, ${ready ? count : 0} ${count === 1 ? "item" : "items"}`}
              onClick={openCart}
            >
              <BagIcon />
              {ready && count > 0 && (
                <span className="absolute right-1 top-1.5 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-semibold leading-5 text-canvas">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
