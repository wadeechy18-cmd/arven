import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartPanel } from "@/components/product/add-to-cart-panel";
import { ProductGrid } from "@/components/product/product-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE_URL } from "@/lib/constants";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    image: product.images.map((i) => `${SITE_URL}${i.url}`),
    brand: { "@type": "Brand", name: "Arven" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${product.slug}`,
    },
  };

  return (
    <div className="container-wide section-y !pt-10">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} />

        <div className="lg:max-w-md">
          <p className="eyebrow mb-2">{product.category.name}</p>
          <h1 className="font-serif text-3xl text-foreground sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-jute text-jute" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span>·</span>
            <span>{product.reviewCount} reviews</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-medium text-foreground">
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">{product.shortDescription}</p>

          <div className="mt-8 border-t border-border pt-8">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-8 grid gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>Ships in 2–4 days</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>30-day returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>2-year craftsmanship guarantee</span>
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-8 border-t border-border">
            <AccordionItem value="details">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <dl className="flex flex-col gap-2">
                  <div className="flex justify-between gap-4">
                    <dt>Material</dt>
                    <dd className="text-right text-foreground">{product.material}</dd>
                  </div>
                  {product.dimensions && (
                    <div className="flex justify-between gap-4">
                      <dt>Dimensions</dt>
                      <dd className="text-right text-foreground">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.origin && (
                    <div className="flex justify-between gap-4">
                      <dt>Origin</dt>
                      <dd className="text-right text-foreground">{product.origin}</dd>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div className="flex justify-between gap-4">
                      <dt>Care</dt>
                      <dd className="text-right text-foreground">{product.careInstructions}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-4">{product.description}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="love-it">
              <AccordionTrigger>Why You&apos;ll Love It</AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2">
                  <li>Hand-finished construction, inspected piece by piece.</li>
                  <li>Materials selected to improve with age and use.</li>
                  <li>Timeless design that works well beyond a single season.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
              <AccordionContent>
                <p>
                  Orders ship within 2–4 business days. Free shipping on orders over $100;
                  standard shipping is $8 otherwise. We accept returns within 30 days of
                  delivery for unused items in original condition.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-24 border-t border-border pt-16">
          <h2 className="mb-10 font-serif text-2xl text-foreground">You May Also Like</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
