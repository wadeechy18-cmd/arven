import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { MailIcon } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact us",
  description: `Get in touch with Daymark in Toronto. Email ${site.email} or send us a message. We reply within 1–2 business days.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Contact us">
        Questions about an order, a product or a wholesale enquiry? We&apos;d love to hear from you.
      </PageHeader>
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_1.4fr] lg:py-16">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold">Email us</h2>
            <a href={`mailto:${site.email}`} className="mt-2 inline-flex min-h-12 items-center gap-3 break-all text-lg link-underline">
              <MailIcon className="shrink-0 text-accent" />
              {site.email}
            </a>
            <p className="mt-1 text-sm text-muted">We reply within 1–2 business days, Monday to Friday.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Based in</h2>
            <p className="mt-2">{site.location}</p>
            <p className="mt-1 text-sm text-muted">Online only for now. Pop-up dates are announced on our newsletter.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Quick answers</h2>
            <p className="mt-2 text-sm leading-6">
              Many questions are answered in our <Link href="/faq" className="link-underline">FAQ</Link>,{" "}
              <Link href="/shipping" className="link-underline">shipping policy</Link> and{" "}
              <Link href="/returns" className="link-underline">returns policy</Link>.
            </p>
          </div>
        </div>
        <div className="rounded-md border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
