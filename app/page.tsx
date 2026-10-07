import Image from "next/image";
import Link from "next/link";
import { FeatureBanner } from "@/components/FeatureBanner";
import { Hero } from "@/components/Hero";
import { ImageWithText } from "@/components/ImageWithText";
import { ProductCarousel } from "@/components/ProductCarousel";
import { TrustStrip } from "@/components/TrustStrip";
import { images } from "@/data/images";
import { percentOff, products } from "@/data/products";
import { site } from "@/data/site";

export const metadata = {
  alternates: { canonical: "/" },
};

const categoryTiles = [
  { label: "Clothing", href: "/collections/clothing", image: images.categoryClothing },
  { label: "Makeup", href: "/collections/makeup", image: images.categoryMakeup },
  { label: "Jute Bags", href: "/collections/jute-bags", image: images.categoryJute },
];

export default function HomePage() {
  const bestSellers = products.filter((p) => p.bestSeller);
  const maxOff = Math.max(0, ...products.map(percentOff));
  const newArrivals = [...products].filter((p) => p.isNew).sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));

  return (
    <>
      <Hero
        priority
        image={images.heroHome}
        eyebrow="New season"
        title="Made for every day. Made to last."
        text="Natural-fibre clothing, clean makeup and handwoven jute bags, designed in Toronto."
        cta={{ label: "Shop now", href: "/collections/new-arrivals" }}
      />

      <section aria-labelledby="shop-by-category" className="container-page py-12 sm:py-16">
        <h2 id="shop-by-category" className="mb-6 text-2xl font-semibold sm:text-3xl">
          Shop by category
        </h2>
        <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
          {categoryTiles.map((tile) => (
            <li key={tile.href} className="w-[75%] shrink-0 snap-start sm:w-auto">
              <Link href={tile.href} className="group relative block aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={tile.image.src}
                  alt={tile.image.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 75vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/60 to-transparent p-5 pt-16 text-canvas">
                  <span className="text-xl font-semibold">{tile.label}</span>
                  <span className="text-sm font-semibold underline underline-offset-4">Shop now</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ProductCarousel title="Shop best sellers" products={bestSellers} viewAllHref="/collections/best-sellers" />

      <FeatureBanner
        image={images.featureJute}
        eyebrow="The golden fibre"
        title="Handwoven jute, built to carry you for years"
        text="Jute is fast-growing, needs little water and no pesticides, and is fully biodegradable. We weave it into bags made to outlast trends."
        cta={{ label: "Shop jute bags", href: "/collections/jute-bags" }}
      />

      <ImageWithText
        image={images.featureMakeup}
        eyebrow="Makeup"
        title="Five minutes, five products, done"
        cta={{ label: "Shop makeup", href: "/collections/makeup" }}
      >
        <p>
          Clean, vegan formulas that work with your skin, not over it. Our Skin Tint Serum comes in 10 shades and our
          Satin Lipstick lives in a refillable case.
        </p>
      </ImageWithText>

      <ImageWithText
        reverse
        image={images.featureClothing}
        eyebrow="Clothing"
        title="Natural fibres for Toronto's every season"
        cta={{ label: "Shop clothing", href: "/collections/clothing" }}
      >
        <p>
          Organic cotton, European linen and Tencel™, cut into easy shapes you&apos;ll reach for again and again. Every
          piece is pre-washed, so the fit you buy is the fit you keep.
        </p>
      </ImageWithText>

      <ProductCarousel title="New arrivals" products={newArrivals} viewAllHref="/collections/new-arrivals" />

      <FeatureBanner
        image={images.featureSale}
        eyebrow="Limited time"
        title={maxOff > 0 ? `Up to ${maxOff}% off selected styles` : "Seasonal favourites"}
        text="Seasonal favourites at their best prices, while stock lasts."
        cta={{ label: "Shop the sale", href: "/collections/sale" }}
      />

      <section aria-label={`Why shop ${site.name}`} className="container-page pt-16">
        <TrustStrip />
      </section>
    </>
  );
}
