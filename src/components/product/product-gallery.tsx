"use client";

import { useState } from "react";
import Image from "@/components/ui/image";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
}: {
  images: { url: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden border bg-secondary transition-colors sm:h-24 sm:w-20",
                active === i ? "border-primary" : "border-transparent",
              )}
            >
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square w-full flex-1 overflow-hidden bg-secondary">
        {current && (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="animate-fade-in object-cover"
          />
        )}
      </div>
    </div>
  );
}
