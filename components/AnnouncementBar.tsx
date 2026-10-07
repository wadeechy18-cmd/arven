"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { announcements } from "@/data/site";
import { ChevronLeft, ChevronRight } from "./Icons";

const INTERVAL_MS = 5000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = announcements.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [paused, count]);

  if (count === 0) return null;
  const current = announcements[index];

  return (
    <div
      className="bg-ink text-canvas"
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-page flex h-10 items-center justify-between gap-2 text-xs sm:text-sm">
        <button
          type="button"
          className="-ml-2 grid size-10 shrink-0 place-items-center opacity-70 hover:opacity-100"
          onClick={() => setIndex((i) => (i - 1 + count) % count)}
          aria-label="Previous announcement"
        >
          <ChevronLeft size={16} />
        </button>
        <p key={index} className="animate-marquee-fade truncate text-center tracking-wide" aria-live={paused ? "polite" : "off"}>
          {current.href ? (
            <Link href={current.href} className="hover:underline underline-offset-4">
              {current.text}
            </Link>
          ) : (
            current.text
          )}
        </p>
        <button
          type="button"
          className="-mr-2 grid size-10 shrink-0 place-items-center opacity-70 hover:opacity-100"
          onClick={() => setIndex((i) => (i + 1) % count)}
          aria-label="Next announcement"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
