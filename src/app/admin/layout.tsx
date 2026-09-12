import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, ExternalLink } from "lucide-react";

import "../globals.css";
import { requireAdmin } from "@/lib/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = {
  title: { default: "Arven Admin", template: "%s — Arven Admin" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
              <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <span className="text-sm font-semibold tracking-wide">Arven Admin</span>
              </div>
              <nav className="flex flex-1 flex-col gap-0.5 p-3">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-3 border-t border-gray-200 p-4">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> View Storefront
                </a>
                <p className="text-xs text-gray-500">{admin.email}</p>
                <SignOutButton />
              </div>
            </aside>
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
