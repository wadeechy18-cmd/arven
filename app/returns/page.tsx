import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Returns & exchanges",
  description: `Free ${site.returnWindowDays}-day returns on full-price Daymark items. How to start a return or exchange.`,
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <TextPage
      eyebrow="Help"
      title="Returns & exchanges"
      intro={`Not quite right? You have ${site.returnWindowDays} days to send it back.`}
      updated="October 2026"
    >
      <h2>Our policy</h2>
      <ul>
        <li>
          <strong>Full-price items:</strong> free returns for a refund, or exchanges, within {site.returnWindowDays}{" "}
          days of delivery.
        </li>
        <li>
          <strong>Sale items:</strong> exchange or store credit only.
        </li>
        <li>
          <strong>Makeup:</strong> unopened, unused products only, for hygiene reasons. If a product causes a
          reaction, contact us and we&apos;ll make it right.
        </li>
        <li>Items must be unworn, unwashed and unused, with original tags attached.</li>
      </ul>

      <h2>How to start a return</h2>
      <ol className="mb-4 list-decimal space-y-1 pl-5">
        <li>
          Email <a href={`mailto:${site.email}`}>{site.email}</a> with your order number and the items you&apos;d like to
          return or exchange.
        </li>
        <li>We&apos;ll send you a prepaid Canada Post return label within one business day.</li>
        <li>Pack the items securely (the original mailer works well) and drop it at any post office.</li>
      </ol>

      <h2>Refunds</h2>
      <p>
        Once your return arrives at our studio, we&apos;ll inspect it and refund your original payment method within
        5 business days. Your bank may take a few more days to show it. Original shipping charges are non-refundable.
      </p>

      <h2>Damaged or wrong item?</h2>
      <p>
        We&apos;re sorry! <Link href="/contact">Contact us</Link> within 7 days of delivery with a photo and
        we&apos;ll send a replacement or a full refund, including shipping.
      </p>
    </TextPage>
  );
}
