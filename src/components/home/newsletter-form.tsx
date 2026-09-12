"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
    if (res.ok) setEmail("");
  }

  if (status === "done") {
    return <p className="text-sm text-foreground">Thank you — you&apos;re on the list.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-md flex-col gap-3 sm:flex-row", compact && "max-w-sm")}
    >
      <Input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <Button type="submit" disabled={status === "loading"} className="shrink-0">
        {status === "loading" ? "Joining…" : "Subscribe"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-destructive sm:hidden">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
