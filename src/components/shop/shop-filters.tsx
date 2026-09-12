"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CategoryView } from "@/lib/data";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function ShopFilters({ categories }: { categories: CategoryView[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "all";
  const activeSort = searchParams.get("sort") ?? "featured";
  const [minPrice, setMinPrice] = useState(searchParams.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") ?? "");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyPriceRange() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("min", minPrice);
    else params.delete("min");
    if (maxPrice) params.set("max", maxPrice);
    else params.delete("max");
    router.push(`${pathname}?${params.toString()}`);
  }

  const categoryTabs = [{ id: "all", name: "All", slug: "all" }, ...categories];

  const filterBody = (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="flex flex-col gap-1">
          {categoryTabs.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateParam("category", c.slug)}
              className={cn(
                "py-1.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground",
                activeCategory === c.slug && "font-medium text-foreground",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Price</p>
        <div className="flex items-center gap-2">
          <Label htmlFor="min-price" className="sr-only">Minimum price</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="Min"
            className="h-9"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted-foreground">–</span>
          <Label htmlFor="max-price" className="sr-only">Maximum price</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="Max"
            className="h-9"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <Button size="sm" variant="subtle" className="mt-3 w-full" onClick={applyPriceRange}>
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="pt-4">{filterBody}</div>
        </SheetContent>
      </Sheet>

      <div className="hidden gap-6 lg:flex">
        {categoryTabs.map((c) => (
          <button
            key={c.slug}
            onClick={() => updateParam("category", c.slug)}
            className={cn(
              "text-sm text-muted-foreground transition-colors hover:text-foreground",
              activeCategory === c.slug && "font-medium text-foreground underline underline-offset-8",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <Select value={activeSort} onValueChange={(v) => updateParam("sort", v)}>
        <SelectTrigger className="h-9 w-44">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
