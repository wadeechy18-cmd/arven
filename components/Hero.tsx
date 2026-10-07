import Image from "next/image";
import Link from "next/link";
import type { SiteImage } from "@/data/images";

/** Full-width banner with headline, subline and button over a photo. */
export function Hero({
  image,
  eyebrow,
  title,
  text,
  cta,
  priority = false,
  align = "left",
  tall = true,
}: {
  image: SiteImage;
  eyebrow?: string;
  title: string;
  text?: string;
  cta?: { label: string; href: string };
  priority?: boolean;
  align?: "left" | "center";
  tall?: boolean;
}) {
  return (
    <section className={`relative isolate overflow-hidden bg-sand ${tall ? "min-h-[78vh] sm:min-h-[70vh]" : "min-h-[52vh]"} flex`}>
      <Image src={image.src} alt={image.alt} fill preload={priority} sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/65 via-ink/20 to-transparent sm:bg-gradient-to-r sm:from-ink/55 sm:via-ink/15" />
      <div
        className={`container-page flex flex-1 flex-col justify-end pb-12 pt-24 text-canvas sm:justify-center sm:pb-16 ${
          align === "center" ? "items-center text-center" : "items-start"
        }`}
      >
        <div className="max-w-xl">
          {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-canvas/85">{eyebrow}</p>}
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
          {text && <p className="mt-4 text-base text-canvas/90 sm:text-lg">{text}</p>}
          {cta && (
            <Link href={cta.href} className="btn-light mt-8">
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
