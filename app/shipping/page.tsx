import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping policy",
  description: `Free shipping across Canada on Daymark orders over $${site.freeShippingThreshold}. Delivery times, rates and tracking.`,
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <TextPage eyebrow="Help" title="Shipping policy" intro="Everything you need to know about getting your order." updated="October 2026">
      <h2>Where we ship</h2>
      <p>We currently ship to addresses across Canada, including P.O. boxes. International shipping is coming soon.</p>

      <h2>Rates</h2>
      <ul>
        <li>
          <strong>Free standard shipping</strong> on orders of ${site.freeShippingThreshold} or more (after discounts,
          before tax).
        </li>
        <li>
          <strong>${site.flatShippingRate} flat rate</strong> on orders under ${site.freeShippingThreshold}.
        </li>
      </ul>

      <h2>Processing and delivery times</h2>
      <p>
        Orders are packed in our Toronto studio and leave within 1–2 business days. Orders placed after 12 p.m. ET on
        Friday, or on weekends and statutory holidays, ship the next business day.
      </p>
      <ul>
        <li>Ontario and Québec: 2–4 business days</li>
        <li>Atlantic Canada and the Prairies: 3–6 business days</li>
        <li>British Columbia: 4–7 business days</li>
        <li>Territories and remote areas: 5–10 business days</li>
      </ul>

      <h2>Tracking</h2>
      <p>
        As soon as your order ships, you&apos;ll get an email with a tracking link. If it hasn&apos;t moved for 5 business
        days, <Link href="/contact">let us know</Link> and we&apos;ll look into it.
      </p>

      <h2>Duties and taxes</h2>
      <p>
        All prices are in Canadian dollars. Applicable GST, HST or PST is calculated at checkout based on your shipping
        address. There are no duties on domestic orders.
      </p>

      <h2>Packaging</h2>
      <p>We ship in recycled, plastic-free packaging. Our mailers can go straight into your paper recycling.</p>
    </TextPage>
  );
}
