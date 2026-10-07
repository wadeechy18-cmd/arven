"use client";

import { useId, useRef, useState, type ReactNode } from "react";

/** Accessible tabs (arrow keys move between tabs). */
export function Tabs({ tabs }: { tabs: { title: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Product information" className="no-scrollbar flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-12 shrink-0 border-b-2 text-sm font-semibold transition-colors ${
              i === active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.title}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="py-5 leading-7 text-ink/85"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
