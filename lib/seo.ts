import type { Metadata } from "next";
import { images } from "@/data/images";
import { site } from "@/data/site";

/** Page metadata with matching Open Graph / Twitter tags. */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: { src: string; width: number; height: number; alt: string };
}): Metadata {
  const og = image ?? images.ogDefault;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      locale: "en_CA",
      type: "website",
      images: [{ url: og.src, width: og.width, height: og.height, alt: og.alt }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [og.src] },
  };
}
