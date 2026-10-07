import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { SiteImage } from "@/data/images";

/** Half photo, half text. `reverse` puts the photo on the right (desktop). */
export function ImageWithText({
  image,
  eyebrow,
  title,
  children,
  cta,
  reverse = false,
}: {
  image: SiteImage;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  cta?: { label: string; href: string };
  reverse?: boolean;
}) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className={`relative aspect-square overflow-hidden bg-sand ${reverse ? "md:order-2" : ""}`}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="max-w-lg">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <div className="mt-4 space-y-4 leading-7 text-ink/80">{children}</div>
          {cta && (
            <Link href={cta.href} className="btn-primary mt-8">
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
