import type { Metadata } from "next";
import Image from "@/components/ui/image";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "We believe everyday products should be beautiful, useful, and made with materials that feel authentic.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="relative flex h-[60vh] items-end overflow-hidden bg-paper">
        <Image
          src="/placeholders/banner-about.svg"
          alt="Leather and jute materials laid out in a workshop"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
        <div className="container-wide relative pb-14 text-ivory">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest2 text-ivory/70">Our Story</p>
          <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Beautiful, useful, and made with materials that feel authentic.
          </h1>
        </div>
      </section>

      <section className="section-y">
        <div className="container-wide grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">How We Started</p>
            <h2 className="font-serif text-3xl text-foreground">
              A small workshop, a simple belief.
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Arven began with a simple frustration: it was hard to find everyday
              carry goods that felt genuinely made, rather than merely manufactured.
              We started with a single jute tote, woven by a small cooperative in
              West Bengal, and a single leather wallet, cut by hand in a workshop in
              Léon. Both are still in the collection today, largely unchanged.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We believe everyday products should be beautiful, useful, and made
              with materials that feel authentic — not disposable, not
              over-designed, just honest.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Our Materials</p>
            <h2 className="font-serif text-3xl text-foreground">Jute &amp; leather, chosen on purpose.</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Jute is one of the most sustainable natural fibres available —
              fast-growing, biodegradable, and remarkably strong for its weight.
              We source it directly from weaving cooperatives who have worked the
              craft for generations.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our leather is full-grain and vegetable-tanned, a slower and more
              traditional process that avoids heavy metals and produces leather
              that ages the way leather should: darker, softer, more itself.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-border bg-secondary/30">
        <div className="container-wide grid gap-10 sm:grid-cols-3">
          {[
            {
              title: "Craftsmanship",
              copy: "Every piece passes through the hands of a single maker, start to finish.",
            },
            {
              title: "Sustainability",
              copy: "Natural, renewable materials, produced in small batches — never overrun.",
            },
            {
              title: "Quality Philosophy",
              copy: "We would rather sell you one wallet that lasts a decade than three that don't.",
            },
          ].map((v) => (
            <div key={v.title}>
              <h3 className="font-serif text-xl text-foreground">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
