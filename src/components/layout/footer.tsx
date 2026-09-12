import Link from "next/link";

import { FOOTER_LINKS, SITE_NAME, SITE_TAGLINE, SOCIAL_LINKS, STORE_EMAIL } from "@/lib/constants";
import { NewsletterForm } from "@/components/home/newsletter-form";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container-wide section-y !py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-serif text-2xl text-foreground">
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{SITE_TAGLINE}</p>
            <p className="mt-6 text-sm text-muted-foreground">
              Questions? Write to{" "}
              <a href={`mailto:${STORE_EMAIL}`} className="text-foreground underline underline-offset-4">
                {STORE_EMAIL}
              </a>
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="eyebrow mb-4">{title}</h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="eyebrow mb-3">Join Our Journey</p>
          <NewsletterForm compact />
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
