import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns & Exchanges" };

export default function ReturnsPage() {
  return (
    <div className="container-wide section-y max-w-prose !pt-14">
      <p className="eyebrow mb-3">Support</p>
      <h1 className="mb-8 font-serif text-3xl text-foreground">Returns &amp; Exchanges</h1>
      <div className="flex flex-col gap-6 leading-relaxed text-muted-foreground">
        <p>
          We want every piece you buy from us to earn its place in your daily
          life. If it doesn&apos;t, we accept returns within 30 days of delivery
          for unused items in their original condition and packaging.
        </p>
        <p>
          To start a return or exchange, email{" "}
          <a href="mailto:hello@arven.co" className="text-foreground underline underline-offset-4">
            hello@arven.co
          </a>{" "}
          with your order number and we&apos;ll send you a prepaid return label.
        </p>
        <p>
          Refunds are issued to your original payment method within 5–7 business
          days of us receiving your return. Items showing wear beyond inspection
          are not eligible for refund but may qualify for our repair program.
        </p>
      </div>
    </div>
  );
}
