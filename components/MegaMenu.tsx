import Image from "next/image";
import Link from "next/link";
import { featuredCollections, subcategoryPath, type CategoryDef } from "@/data/navigation";
import { TrustStrip } from "./TrustStrip";

/** The wide dropdown panel for one category (desktop only). */
export function MegaMenuPanel({ category, id }: { category: CategoryDef; id: string }) {
  const base = `/collections/${category.slug}`;
  return (
    <div id={id} className="absolute inset-x-0 top-full border-t border-line bg-surface shadow-[0_12px_24px_-12px_rgb(0_0_0/0.15)] animate-fade-in">
      <div className="container-page grid grid-cols-12 gap-8 py-10">
        <div className="col-span-8 grid grid-cols-3 gap-8">
          {category.groups.map((group) => (
            <div key={group.label}>
              <p className="eyebrow mb-4">
                {group.slug ? (
                  <Link href={`${base}/${group.slug}`} className="hover:text-ink">
                    {group.label}
                  </Link>
                ) : (
                  group.label
                )}
              </p>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <Link href={`${base}/${subcategoryPath(group, item)}`} className="text-[15px] hover:underline underline-offset-4">
                      {item.label}
                    </Link>
                  </li>
                ))}
                {group.slug && (
                  <li>
                    <Link href={`${base}/${group.slug}`} className="text-[15px] font-semibold hover:underline underline-offset-4">
                      Shop all {group.label}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow mb-4">Featured</p>
            <ul className="space-y-3">
              {featuredCollections.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`${base}/${f.slug}`}
                    className={`text-[15px] hover:underline underline-offset-4 ${f.slug === "sale" ? "text-sale" : ""}`}
                  >
                    {f.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={base} className="text-[15px] font-semibold hover:underline underline-offset-4">
                  Shop all {category.label}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Link href={category.promo.href} className="group col-span-4 block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand">
            <Image
              src={category.promo.image.src}
              alt={category.promo.image.alt}
              fill
              sizes="30vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <p className="mt-3 font-semibold">{category.promo.title}</p>
          <p className="text-sm text-muted">{category.promo.text}</p>
          <span className="mt-1 inline-block text-sm font-semibold link-underline">Shop now</span>
        </Link>
      </div>
      <div className="border-t border-line bg-canvas">
        <div className="container-page py-4">
          <TrustStrip compact />
        </div>
      </div>
    </div>
  );
}
