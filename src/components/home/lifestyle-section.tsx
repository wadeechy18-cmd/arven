import Image from "@/components/ui/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LifestyleSection() {
  return (
    <section className="section-y">
      <div className="container-wide">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary sm:translate-y-10">
            <Image
              src="/placeholders/banner-editorial-01.svg"
              alt="Jute tote carried through a market"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
            <Image
              src="/placeholders/banner-editorial-02.svg"
              alt="Leather wallet resting on a wooden desk"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="eyebrow">Made for Everyday</p>
          <h2 className="max-w-lg font-serif text-3xl text-foreground sm:text-4xl">
            Pieces that live in your routine, not your closet.
          </h2>
          <Button variant="outline" size="lg" asChild>
            <Link href="/shop">Shop the Edit</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
