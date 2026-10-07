import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ImageWithText } from "@/components/ImageWithText";
import { TrustStrip } from "@/components/TrustStrip";
import { images } from "@/data/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About us",
  description:
    "Daymark is a Toronto brand making handwoven jute bags, natural-fibre clothing and clean makeup, built on eco-friendly materials and careful craftsmanship.",
  path: "/about",
  image: images.aboutHero,
});

const values = [
  {
    title: "Natural first",
    text: "Jute, organic cotton, linen and Tencel™. We choose fibres that grow back fast and break down at the end of their life.",
  },
  {
    title: "Fewer, better",
    text: "We design small collections and make them well, so you can buy less and keep it longer.",
  },
  {
    title: "Fair hands",
    text: "Our jute is woven by partner workshops that pay fair wages and that we visit in person.",
  },
  {
    title: "Honest beauty",
    text: "Vegan, cruelty-free makeup with short ingredient lists and refillable packaging wherever we can.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        priority
        image={images.aboutHero}
        eyebrow="Our story"
        title="A mark of a good day"
        text="Daymark began in a Toronto kitchen with one handwoven jute tote and a simple idea: everyday things should be beautiful, useful and kind to the planet."
        tall={false}
      />

      <section className="container-page max-w-3xl py-16 text-center sm:py-24">
        <p className="eyebrow mb-4">Who we are</p>
        <p className="text-2xl leading-snug sm:text-3xl">
          We make the things you reach for every day, from the bag on your shoulder to the tint on your skin, using
          natural materials and the kind of craftsmanship that lasts.
        </p>
      </section>

      <ImageWithText image={images.aboutJute} eyebrow="Why jute" title="The golden fibre">
        <p>
          Jute is one of the most sustainable fibres on earth. It grows in just four months, needs little water and no
          pesticides, and absorbs more carbon dioxide than most trees while it grows.
        </p>
        <p>
          It&apos;s also remarkably strong. A Daymark jute bag can carry a full grocery shop for years, and when it
          finally wears out, it&apos;s 100% biodegradable.
        </p>
      </ImageWithText>

      <ImageWithText reverse image={images.aboutCraft} eyebrow="Craftsmanship" title="Made slowly, by hand">
        <p>
          Every jute bag is woven and stitched by hand by skilled artisans in our partner workshops. Handles are
          reinforced, seams are double-stitched, and every piece is checked before it leaves for Toronto.
        </p>
        <p>
          Our clothing is cut from organic cotton, linen and Tencel™, pre-washed so it keeps its shape, and our makeup
          is formulated in small batches in Canada.
        </p>
      </ImageWithText>

      <section aria-labelledby="values" className="bg-sand/70">
        <div className="container-page py-16 sm:py-20">
          <h2 id="values" className="text-2xl font-semibold sm:text-3xl">
            What we stand for
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li key={v.title}>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 leading-7 text-ink/80">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <TrustStrip />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/collections/jute-bags" className="btn-primary">
            Shop jute bags
          </Link>
          <Link href="/contact" className="btn-secondary">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
