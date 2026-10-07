import Link from "next/link";
import { footerLinks } from "@/data/navigation";
import { site } from "@/data/site";
import { FacebookIcon, GlobeIcon, InstagramIcon, PinterestIcon, TikTokIcon } from "./Icons";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const socials = [
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: site.social.tiktok, Icon: TikTokIcon },
  { label: "Pinterest", href: site.social.pinterest, Icon: PinterestIcon },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-canvas">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-semibold">Join the Daymark list</h2>
          <p className="mt-2 max-w-md text-canvas/75">
            New arrivals, restocks and member-only offers, straight to your inbox.
          </p>
          <div className="mt-6 max-w-md">
            <NewsletterForm tone="dark" />
          </div>
          <ul className="mt-6 flex gap-2" aria-label="Daymark on social media">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-12 place-items-center rounded-full border border-canvas/25 hover:bg-canvas hover:text-ink"
                  aria-label={`${label} (opens in a new tab)`}
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:pl-12">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-canvas/60">{heading}</h2>
              <ul className="mt-4 space-y-1">
                {links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-[15px] hover:underline underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-canvas/60">Get in touch</h2>
            <p className="mt-4 text-[15px] leading-7">
              {site.location}
              <br />
              <a href={`mailto:${site.email}`} className="break-all hover:underline underline-offset-4">
                {site.email}
              </a>
            </p>
          </div>
        </nav>
      </div>

      <div className="border-t border-canvas/15">
        <div className="container-page flex flex-col gap-4 py-6 text-sm text-canvas/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <Logo className="inline-flex text-canvas [&_span]:text-lg" />
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          </div>
          <div className="relative inline-flex items-center gap-2">
            <GlobeIcon size={18} />
            <label htmlFor="region" className="sr-only">
              Country / region
            </label>
            {/* Only Canada for now. Add more <option>s when shipping expands. */}
            <select
              id="region"
              defaultValue="CA"
              className="min-h-11 cursor-pointer appearance-none rounded-md border border-canvas/25 bg-transparent pl-3 pr-8 text-canvas"
            >
              <option value="CA" className="text-ink">
                Canada (CAD $)
              </option>
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-3">▾</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
