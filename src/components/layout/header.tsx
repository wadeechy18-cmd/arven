import Link from "next/link";
import { User } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { MAIN_NAV, SITE_NAME } from "@/lib/constants";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchDialog } from "@/components/layout/search-dialog";
import { CartButton } from "@/components/layout/cart-button";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="hidden bg-primary py-2 text-center text-xs tracking-wide text-primary-foreground sm:block">
        Complimentary shipping on orders over $100 · Handcrafted in small batches
      </div>
      <div className="container-wide flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileNav isAuthenticated={!!user} />
          <Link href="/" className="font-serif text-2xl tracking-wide text-foreground">
            {SITE_NAME}
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog />
          <Link
            href={user ? "/account" : "/login"}
            aria-label={user ? "Your account" : "Sign in"}
            className="hidden h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-clay sm:flex"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
