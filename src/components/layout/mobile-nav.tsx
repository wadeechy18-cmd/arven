"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MAIN_NAV } from "@/lib/constants";

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-xs">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 pt-4">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base text-foreground transition-colors hover:text-clay"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-2" />
        <Link
          href={isAuthenticated ? "/account" : "/login"}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 py-3 text-sm text-foreground"
        >
          <User className="h-4 w-4" strokeWidth={1.5} />
          {isAuthenticated ? "Your Account" : "Sign In"}
        </Link>
        <div className="mt-auto flex flex-col gap-1 pt-6 text-sm text-muted-foreground">
          <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/shipping" onClick={() => setOpen(false)}>Shipping</Link>
          <Link href="/returns" onClick={() => setOpen(false)}>Returns</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
