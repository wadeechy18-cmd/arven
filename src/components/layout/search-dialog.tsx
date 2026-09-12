"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Search products"
          className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-clay"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </DialogTrigger>
      <DialogContent className="top-40 translate-y-0 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Search Arven</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            autoFocus
            placeholder="Search jute bags, leather wallets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
