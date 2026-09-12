import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div className="container-wide section-y max-w-prose !pt-14">
      <p className="eyebrow mb-3">Support</p>
      <h1 className="mb-8 font-serif text-3xl text-foreground">Shipping</h1>
      <div className="flex flex-col gap-6 leading-relaxed text-muted-foreground">
        <p>
          Orders are handmade to order in small batches and typically ship within
          2–4 business days. You&apos;ll receive a confirmation email with tracking
          information as soon as your order leaves our studio.
        </p>
        <p>
          <span className="font-medium text-foreground">Standard Shipping</span> — $8,
          arrives in 4–7 business days. Free on orders over $100.
        </p>
        <p>
          <span className="font-medium text-foreground">Expedited Shipping</span> —
          available at checkout for select regions, arrives in 2–3 business days.
        </p>
        <p>
          International orders may be subject to customs fees determined by your
          country&apos;s import regulations, which are the responsibility of the
          recipient.
        </p>
      </div>
    </div>
  );
}
