import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Daymark account.",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <>
      <PageHeader title="Account">Customer accounts are coming soon.</PageHeader>
      <div className="container-page max-w-2xl py-12 prose-page">
        <p>
          You don&apos;t need an account to shop. Checkout as a guest and we&apos;ll email your order confirmation and
          tracking details.
        </p>
        <p>
          Need help with an order? Email <a href={`mailto:${site.email}`}>{site.email}</a> with your order number, or
          visit our <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </>
  );
}
