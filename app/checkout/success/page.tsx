import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/ClearCart";
import { CheckIcon } from "@/components/Icons";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Thank you for your order",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <ClearCart />
      <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent">
        <CheckIcon size={32} />
      </span>
      <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Thank you for your order</h1>
      <p className="mt-4 max-w-md text-muted">
        A confirmation is on its way to your inbox. We&apos;ll email you tracking details as soon as your order
        leaves our Toronto studio. Questions? Write to{" "}
        <a href={`mailto:${site.email}`} className="link-underline text-ink">
          {site.email}
        </a>
        .
      </p>
      <Link href="/" className="btn-primary mt-8">
        Continue shopping
      </Link>
    </div>
  );
}
