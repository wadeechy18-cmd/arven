"use client";

import { useState } from "react";

const TOPICS = ["Order question", "Product question", "Returns & exchanges", "Wholesale", "Press", "Something else"];

/** Posts to /api/contact. See app/api/contact/route.ts to connect an email service. */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message);
      setStatus("done");
      setMessage(data.message ?? "Thanks! We'll be in touch soon.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error && err.message ? err.message : "Something went wrong. Please email us instead.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="text-sm font-medium">
            Name
          </label>
          <input id="c-name" name="name" required autoComplete="name" className="input mt-2" />
        </div>
        <div>
          <label htmlFor="c-email" className="text-sm font-medium">
            Email
          </label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className="input mt-2" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-topic" className="text-sm font-medium">
            Topic
          </label>
          <select id="c-topic" name="topic" className="input mt-2" defaultValue={TOPICS[0]}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="c-order" className="text-sm font-medium">
            Order number <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="c-order" name="order" className="input mt-2" />
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="text-sm font-medium">
          Message
        </label>
        <textarea id="c-message" name="message" required minLength={5} rows={6} className="input mt-2 py-3" />
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-primary justify-self-start">
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      <p role="status" className={`text-sm ${status === "error" ? "text-sale" : "text-accent"}`}>
        {status === "done" || status === "error" ? message : ""}
      </p>
    </form>
  );
}
