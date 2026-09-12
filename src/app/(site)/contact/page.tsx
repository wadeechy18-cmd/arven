import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { SOCIAL_LINKS, STORE_ADDRESS, STORE_EMAIL, STORE_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Arven team.",
};

export default function ContactPage() {
  return (
    <div className="container-wide section-y !pt-14">
      <div className="mb-14 max-w-lg">
        <p className="eyebrow mb-3">Contact</p>
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">We&apos;d Love to Hear From You</h1>
        <p className="mt-4 text-muted-foreground">
          Questions about an order, a material, or a custom request — write to us and we&apos;ll reply
          within one business day.
        </p>
      </div>

      <div className="grid gap-16 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <a href={`mailto:${STORE_EMAIL}`} className="text-sm text-muted-foreground hover:text-foreground">
                {STORE_EMAIL}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-foreground">Phone</p>
              <a href={`tel:${STORE_PHONE}`} className="text-sm text-muted-foreground hover:text-foreground">
                {STORE_PHONE}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-foreground">Studio</p>
              <p className="text-sm text-muted-foreground">{STORE_ADDRESS}</p>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Follow Along</p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
