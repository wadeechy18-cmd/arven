"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

/** Posts to /api/newsletter. See app/api/newsletter/route.ts to connect a mailing-list provider. */
export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Something went wrong.");
      setStatus("done");
      setMessage(data.message ?? "Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const dark = tone === "dark";
  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <label htmlFor={`newsletter-${tone}`} className="sr-only">
        Email address
      </label>
      <div className={`flex gap-2 rounded-full border p-1 ${dark ? "border-canvas/40" : "border-line bg-surface"}`}>
        <input
          id={`newsletter-${tone}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={`min-h-11 flex-1 bg-transparent px-4 text-base outline-none ${dark ? "placeholder:text-canvas/60" : "placeholder:text-muted/70"}`}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className={`min-h-11 rounded-full px-5 text-sm font-semibold disabled:opacity-60 ${dark ? "bg-canvas text-ink" : "bg-ink text-canvas"}`}
        >
          {status === "sending" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      <p role="status" className={`mt-2 min-h-5 text-sm ${status === "error" ? "text-sale" : dark ? "text-canvas/80" : "text-muted"}`}>
        {status === "done" || status === "error" ? message : ""}
      </p>
    </form>
  );
}
