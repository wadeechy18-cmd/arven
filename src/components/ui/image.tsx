import NextImage, { type ImageProps } from "next/image";

/**
 * Local placeholder art is SVG, which this project's image host can't
 * rasterize through the optimizer — serve those unoptimized (harmless,
 * they're already vector) while real photos still get full optimization.
 */
export default function Image(props: ImageProps) {
  const isSvg = typeof props.src === "string" && props.src.endsWith(".svg");
  return <NextImage unoptimized={isSvg} {...props} />;
}
