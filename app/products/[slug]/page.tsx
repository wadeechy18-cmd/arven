import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeafIcon, ReturnIcon, TruckIcon } from "@/components/Icons";
import { Price } from "@/components/Price";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchase } from "@/components/ProductPurchase";
import { Tabs } from "@/components/Tabs";
import { categories } from "@/data/navigation";
import { getProduct, isOnSale, PRODUCT_IMAGE_SIZE, productImages, products } from "@/data/products";
import { site } from "@/data/site";
import { subcategoryLabel } from "@/lib/collections";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.name,
    description: `${p.shortDescription} ${formatPrice(p.price)} CAD. Free Canadian shipping over $${site.freeShippingThreshold}.`,
    path: `/products/${p.slug}`,
    image: { src: productImages(p)[0], ...PRODUCT_IMAGE_SIZE, alt: p.name },
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category)!;
  const images = productImages(product);
  const related = products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      // Same sub-category first, then same category, then best sellers.
      const score = (p: typeof a) =>
        (p.subcategory === product.subcategory ? 4 : 0) + (p.category === product.category ? 2 : 0) + (p.bestSeller ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.map((src) => new URL(src, site.url).toString()),
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: site.currency,
      availability: "https://schema.org/InStock",
      url: new URL(`/products/${product.slug}`, site.url).toString(),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container-page pt-5 sm:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: category.label, href: `/collections/${category.slug}` },
            { label: subcategoryLabel(product), href: `/collections/${category.slug}/${product.subcategory}` },
          ]}
          current={product.name}
        />
      </div>

      <div className="container-page grid gap-8 pt-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 lg:pt-8">
        <ProductGallery images={images} name={product.name} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{subcategoryLabel(product)}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3 text-lg">
            <Price product={product} showBadge />
          </div>
          {isOnSale(product) && <p className="mt-1 text-sm text-muted">Sale items can be exchanged but not refunded.</p>}
          <p className="mt-4 leading-7 text-ink/80">{product.shortDescription}</p>

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>

          <ul className="mt-8 space-y-3 rounded-md bg-sand/70 p-5 text-sm">
            <li className="flex gap-3">
              <TruckIcon size={20} className="shrink-0 text-accent" />
              <span>
                <strong>Free shipping</strong> on Canadian orders over ${site.freeShippingThreshold}. Ships in 1–2
                business days from Toronto.
              </span>
            </li>
            <li className="flex gap-3">
              <ReturnIcon size={20} className="shrink-0 text-accent" />
              <span>
                <strong>Free {site.returnWindowDays}-day returns</strong> on full-price items.{" "}
                <Link href="/returns" className="link-underline">
                  Returns policy
                </Link>
              </span>
            </li>
            <li className="flex gap-3">
              <LeafIcon size={20} className="shrink-0 text-accent" />
              <span>
                <strong>Made to last</strong> from natural and responsibly sourced materials.
              </span>
            </li>
          </ul>

          <div className="mt-8">
            <Tabs
              tabs={[
                { title: "Description", content: <p>{product.description}</p> },
                ...product.details.map((d) => ({ title: d.title, content: <p>{d.body}</p> })),
                {
                  title: "Shipping & Returns",
                  content: (
                    <div className="space-y-3">
                      <p>
                        Orders over ${site.freeShippingThreshold} ship free anywhere in Canada. Under that, a flat $
                        {site.flatShippingRate} applies. Most orders arrive in 2–7 business days.
                      </p>
                      <p>
                        Not quite right? Return unworn, unused items within {site.returnWindowDays} days for a full
                        refund. Opened makeup can&apos;t be returned for hygiene reasons.{" "}
                        <Link href="/shipping" className="link-underline">
                          Shipping policy
                        </Link>{" "}
                        ·{" "}
                        <Link href="/returns" className="link-underline">
                          Returns
                        </Link>
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <ProductCarousel title="You may also like" products={related} />
    </>
  );
}
