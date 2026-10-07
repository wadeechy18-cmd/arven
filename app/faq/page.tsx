import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PlusIcon } from "@/components/Icons";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description: "Answers to common questions about Daymark orders, shipping, returns, jute care and our makeup.",
  path: "/faq",
});

// Edit questions and answers here.
const sections: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Orders & shipping",
    items: [
      { q: "How much is shipping?", a: `Shipping is free across Canada on orders over $${site.freeShippingThreshold}. Under that, it's a flat $${site.flatShippingRate}.` },
      { q: "How long will my order take?", a: "Orders leave our Toronto studio in 1–2 business days and usually arrive within 2–7 business days, depending on where you are." },
      { q: "Do you ship outside Canada?", a: "Not yet. We're working on shipping to the US. Join our newsletter to hear first." },
      { q: "Can I change or cancel my order?", a: `If it hasn't shipped yet, yes. Email ${site.email} as soon as possible with your order number.` },
    ],
  },
  {
    title: "Returns",
    items: [
      { q: "What is your return policy?", a: `Full-price items can be returned within ${site.returnWindowDays} days for a refund. Sale items can be exchanged or returned for store credit.` },
      { q: "Can I return makeup?", a: "Unopened makeup, yes. Opened makeup can't be returned for hygiene reasons, but if something isn't right for your skin, get in touch and we'll help." },
    ],
  },
  {
    title: "Jute & materials",
    items: [
      { q: "Why jute?", a: "Jute grows quickly with little water and no pesticides, is extremely strong, and is fully biodegradable at the end of its life." },
      { q: "How do I clean my jute bag?", a: "Spot clean with a damp cloth and a little mild soap, then let it air dry. Don't machine wash, soak or bleach jute; it can lose its shape." },
      { q: "Will my jute bag smell?", a: "New jute can have a faint natural, earthy scent. It fades within a few days of airing out." },
      { q: "Are your clothes pre-shrunk?", a: "Yes. All our cotton and linen is pre-washed, so the fit you buy is the fit you keep when you follow the care label." },
    ],
  },
  {
    title: "Makeup",
    items: [
      { q: "Is your makeup vegan and cruelty-free?", a: "Yes. All Daymark makeup is vegan and never tested on animals." },
      { q: "How do I find my Skin Tint shade?", a: `Each shade has a description on the product page. Still unsure? Email us a photo in natural light at ${site.email} and we'll recommend one.` },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.flatMap((s) =>
      s.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader eyebrow="Help" title="Frequently asked questions" />
      <div className="container-page max-w-3xl py-10 sm:py-14">
        {sections.map((s) => (
          <section key={s.title} className="mb-12">
            <h2 className="mb-2 text-xl font-semibold">{s.title}</h2>
            <div className="divide-y divide-line border-y border-line">
              {s.items.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <PlusIcon size={18} className="shrink-0 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="pb-5 leading-7 text-ink/80">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="text-muted">
          Still have a question?{" "}
          <Link href="/contact" className="link-underline text-ink">
            Contact us
          </Link>
          .
        </p>
      </div>
    </>
  );
}
