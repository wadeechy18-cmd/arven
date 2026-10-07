import Image from "next/image";
import Link from "next/link";
import type { SiteImage } from "@/data/images";

/** Full-bleed photo banner used between home page sections. */
export function FeatureBanner({
  image,
  eyebrow,
  title,
  text,
  cta,
}: {
  image: SiteImage;
  eyebrow?: string;
  title: string;
  text?: string;
  cta: { label: string; href: string };
}) {
  return (
    <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden bg-sand sm:min-h-[56vh]">
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/35" />
      <div className="container-page flex flex-col items-center py-20 text-center text-canvas">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-canvas/85">{eyebrow}</p>}
        <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">{title}</h2>
        {text && <p className="mt-4 max-w-xl text-canvas/90 sm:text-lg">{text}</p>}
        <Link href={cta.href} className="btn-light mt-8">
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
