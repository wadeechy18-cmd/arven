import Image from "@/components/ui/image";
import Link from "next/link";

const collections = [
  {
    title: "Jute Bags",
    description: "Hand-woven totes and market bags in natural fibre.",
    href: "/shop?category=jute-bags",
    image: "/placeholders/texture-jute-01.svg",
  },
  {
    title: "Leather Wallets",
    description: "Full-grain leather, cut and stitched by hand.",
    href: "/shop?category=leather-wallets",
    image: "/placeholders/texture-leather-01.svg",
  },
  {
    title: "Best Sellers",
    description: "The pieces our customers return for, again and again.",
    href: "/shop?filter=best-sellers",
    image: "/placeholders/texture-leather-02.svg",
  },
];

export function FeaturedCollections() {
  return (
    <section className="section-y">
      <div className="container-wide">
        <div className="mb-12 max-w-lg">
          <p className="eyebrow mb-3">Explore</p>
          <h2 className="font-serif text-3xl text-foreground sm:text-4xl">Featured Collections</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.title} href={c.href} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                  <h3 className="font-serif text-2xl">{c.title}</h3>
                  <p className="mt-1 text-sm text-ivory/80">{c.description}</p>
                  <span className="mt-3 inline-block text-xs font-medium uppercase tracking-widest2 underline underline-offset-4">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
