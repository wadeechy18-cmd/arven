import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionView, type CategoryFacet } from "@/components/CollectionView";
import { categories, subcategoryPath } from "@/data/navigation";
import { allCollectionPaths, resolveCollection, type Collection } from "@/lib/collections";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return allCollectionPaths().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = resolveCollection(slug);
  if (!c) return {};
  return pageMetadata({
    title: c.title,
    description: `${c.description} Shop ${c.title} at Daymark, Toronto. Free Canadian shipping over $99.`,
    path: `/collections/${c.path}`,
    image: c.banner,
  });
}

function categoryFacetFor(c: Collection): CategoryFacet {
  if (c.category) {
    const options = c.category.groups.flatMap((g) =>
      g.items.map((item) => ({
        value: subcategoryPath(g, item),
        label: g.slug ? `${g.label} ${item.label}` : item.label,
      })),
    );
    return { key: "subcategory", options };
  }
  return { key: "category", options: categories.map((cat) => ({ value: cat.slug, label: cat.label })) };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[...slug]">) {
  const { slug } = await params;
  const collection = resolveCollection(slug);
  if (!collection) notFound();

  const isTopLevel = slug.length === 1;
  const showSize = collection.products.some((p) => p.sizes?.length);
  const colourLabel = collection.category?.slug === "makeup" ? "Shade" : "Colour";

  return (
    <>
      <section className={`relative isolate flex items-end overflow-hidden bg-sand ${isTopLevel ? "min-h-[38vh]" : "min-h-[26vh]"}`}>
        <Image src={collection.banner.src} alt="" fill preload sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/60 to-ink/5" />
        <div className="container-page pb-8 pt-16 text-canvas">
          <Breadcrumbs tone="light" items={collection.breadcrumbs} current={collection.title} />
          <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">{collection.title}</h1>
          <p className="mt-2 max-w-xl text-canvas/90">{collection.description}</p>
        </div>
      </section>

      <nav aria-label="Collections" className="border-b border-line">
        <ul className="no-scrollbar container-page flex gap-2 overflow-x-auto py-4">
          {collection.chips.map((chip) => (
            <li key={chip.href} className="shrink-0">
              <Link
                href={chip.href}
                aria-current={chip.active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm ${
                  chip.active ? "border-ink bg-ink text-canvas" : "border-line bg-surface hover:border-ink"
                }`}
              >
                {chip.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <CollectionView
        key={collection.path}
        products={collection.products}
        categoryFacet={categoryFacetFor(collection)}
        showSize={showSize}
        colourLabel={colourLabel}
      />
    </>
  );
}
