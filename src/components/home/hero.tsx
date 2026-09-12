import Image from "@/components/ui/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-paper">
      <Image
        src="/placeholders/banner-hero.svg"
        alt="Jute tote and leather goods styled on a natural linen surface"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ivory/90 via-ivory/50 to-transparent" />

      <div className="container-wide relative">
        <div className="max-w-xl animate-fade-in-up">
          <p className="eyebrow mb-5 text-clay">Handcrafted Since 2016</p>
          <h1 className="font-serif text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Crafted from Nature,
            <br />
            Made to Last.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Jute bags and full-grain leather goods, shaped by hand from
            materials that only grow more beautiful with time.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Explore Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
