import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container-wide section-y max-w-prose !pt-14">
      <p className="eyebrow mb-3">Legal</p>
      <h1 className="mb-8 font-serif text-3xl text-foreground">Terms of Service</h1>
      <div className="flex flex-col gap-6 leading-relaxed text-muted-foreground">
        <p>
          By placing an order with Arven, you agree to provide accurate purchase
          and account information and to use this site only for lawful purposes.
        </p>
        <p>
          All product descriptions, pricing, and availability are subject to
          change without notice. We reserve the right to refuse or cancel any
          order at our discretion, including in cases of suspected fraud.
        </p>
        <p>
          All content on this site — including photography, text, and design —
          is the property of Arven and may not be reproduced without permission.
        </p>
      </div>
    </div>
  );
}
