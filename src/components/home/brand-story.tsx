import Image from "@/components/ui/image";

const pillars = [
  {
    title: "Natural Jute",
    copy: "Grown and hand-woven in West Bengal, jute is one of the strongest natural fibres in the world — breathable, biodegradable, and beautifully textured.",
  },
  {
    title: "Genuine Leather",
    copy: "Full-grain, vegetable-tanned hides, cut and stitched by hand in small workshops. Leather that darkens and softens with every year of use.",
  },
];

export function BrandStory() {
  return (
    <section className="section-y">
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary lg:order-2">
          <Image
            src="/placeholders/banner-craft.svg"
            alt="Craftsperson working leather by hand"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="lg:order-1">
          <p className="eyebrow mb-3">Materials & Craft</p>
          <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Two materials.
            <br />
            One standard of care.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            Every piece we make begins with a material chosen for how it ages, not
            just how it looks on day one. We work with small workshops that measure
            success in years of use, not units shipped.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.title} className="border-t border-border pt-5">
                <h3 className="font-serif text-lg text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
