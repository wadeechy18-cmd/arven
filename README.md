# Daymark: online store

Daymark sells clothing, makeup and jute bags. This is the store's website, based in Toronto, with prices in CAD.
It's built with Next.js (App Router), TypeScript and Tailwind CSS, and is ready to deploy on Vercel.

---

## 1. Run it on your computer

You need **Node.js 20.9 or newer** (download the LTS version from https://nodejs.org).

```bash
cd daymark
npm install        # first time only
npm run dev        # start the site
```

Open **http://localhost:3000**. The page reloads by itself when you save a file.

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site locally while you work on it |
| `npm run build` | Builds the site the way Vercel will (good for catching errors before you deploy) |
| `npm start` | Serves the built site (run `npm run build` first) |
| `npm run lint` | Checks the code for common mistakes |
| `npm run images` | Rebuilds `IMAGES.md` and adds placeholders for any new photos |

---

## 2. Edit products

**Every product lives in one file: `data/products.ts`.** The top of that file explains each field.

- **Change a price:** edit `price: 48`.
- **Put something on sale:** add `compareAtPrice: 60` (the original price). The site then shows the struck-through
  price and the "% off" badge, and adds the product to the Sale pages.
- **Mark as new or best seller:** `isNew: true` / `bestSeller: true`.
- **Colours or shades:** edit `swatches` (`name` is shown to customers, `hex` is the colour of the dot).
- **Sizes:** edit `sizes` (leave it out for products without sizes).
- **Add a product:** copy an existing one, give it a new unique `slug` (lowercase-with-dashes), then run
  `npm run images` to make placeholder photos for it and add them to the checklist.
- **Remove a product:** delete its block.

`subcategory` must match a menu entry in `data/navigation.ts` (for example `"mens/t-shirts"`, `"lips"`, `"totes"`).

Other text you may want to edit:

| What | File |
|---|---|
| Announcement bar messages, email, social links, free-shipping threshold, return window | `data/site.ts` |
| Menus, categories and sub-categories, menu promo tiles, footer links | `data/navigation.ts` |
| FAQ questions | `app/faq/page.tsx` |
| Policy pages | `app/shipping`, `app/returns`, `app/privacy`, `app/terms` |
| Home page headlines | `app/page.tsx` |

---

## 3. Replace placeholder images

**`IMAGES.md`** lists every image the site needs: file name, where it appears, and the recommended size.
Send it to the client as a checklist.

To swap a placeholder for a real photo, **save the photo with exactly the same file name in the same folder**
(inside `public/images/…`), replacing the grey placeholder. No code changes are needed.

- Product photos: `public/images/products/<category>/<product-slug>-1.jpg`, `-2.jpg`, `-3.jpg`
  (photo 1 is the main image; photo 2 shows when you hover a product card).
- Banners: `public/images/banners/…`, menu tiles: `public/images/promos/…`, About page: `public/images/about/…`.
- Photos are automatically resized and compressed for each screen, so a large, good-quality JPG is fine.
- Want more or fewer photos for a product? Set `images: 4` (for example) on that product, then run `npm run images`.

Tip: while `npm run dev` is running, restart it after replacing photos if the old placeholder still shows (it's cached).

---

## 4. Change colours, font and logo

**Colours** are defined once, in `app/globals.css` inside `@theme { … }`:

```css
--color-canvas: #faf8f4;   /* page background */
--color-ink:    #24221f;   /* text and buttons */
--color-jute:   #c2a36b;   /* natural jute tan */
--color-accent: #56644a;   /* muted olive accent */
--color-sale:   #9c4a2f;   /* sale prices and badges */
…
```

Change a hex value and it updates everywhere. Each colour becomes Tailwind classes (`bg-ink`, `text-accent`, `border-line`…).

**Font:** DM Sans from Google Fonts, set in `app/layout.tsx`. To change it, replace `DM_Sans` with another Google font
(for example `Inter` or `Manrope`).

**Logo:** currently a text wordmark in `components/Logo.tsx`. To use an image, save it as `public/logo.svg` and follow
the comment at the top of that file. The browser-tab icon is `app/icon.svg`.

---

## 5. Turn on payments (Stripe Checkout, CAD)

The checkout page is built. Until Stripe is connected, pressing "Continue to payment" shows a friendly message
asking the customer to order by email.

To switch payments on:

1. Create a Stripe account at https://dashboard.stripe.com/register (country: Canada).
2. In Stripe, go to **Developers → API keys** and copy the **Secret key** (`sk_test_…` while testing).
3. Add it as an environment variable called `STRIPE_SECRET_KEY`:
   - **Locally:** copy `.env.example` to `.env.local` and paste the key in, then restart `npm run dev`.
   - **On Vercel:** Project → Settings → Environment Variables → add `STRIPE_SECRET_KEY`, then redeploy.
4. Test with card **4242 4242 4242 4242**, any future expiry date and any CVC.
5. When ready for real orders, swap in the live key (`sk_live_…`).

Full notes, including turning on automatic GST/HST/PST with Stripe Tax and order webhooks, are in the
`TODO(stripe)` comment at the top of `app/api/checkout/route.ts`. Prices are always read from `data/products.ts`
on the server, so customers can't change what they pay.

## 6. Email: contact form & newsletter (Resend)

Both forms send through **Resend** (free for up to 3,000 emails a month). Until it's set up, the forms politely
tell visitors to email the shop directly, so no message is ever silently lost.

1. Go to **https://resend.com** and sign up **with the inbox that should receive website messages**
   (e.g. the shop's email). Before you verify a domain, Resend can only deliver to this address.
2. **API Keys → Create API key** → name it "Daymark website" → permission **Full access** → copy the key
   (starts with `re_`). You only see it once.
3. *(Newsletter list, optional)* **Audiences** → open the default audience → copy its **ID**.
   Without this, the shop simply gets an email for every new subscriber.
4. In **Vercel → your project → Settings → Environment Variables**, add:

   | Name | Value | Needed? |
   |---|---|---|
   | `RESEND_API_KEY` | the key from step 2 | **Yes** |
   | `RESEND_AUDIENCE_ID` | the ID from step 3 | Optional |
   | `CONTACT_TO_EMAIL` | where messages should go (defaults to the email in `data/site.ts`) | Optional |
   | `CONTACT_FROM_EMAIL` | e.g. `Daymark <hello@daymark.ca>`, only after step 6 | Optional |

5. **Deployments → ⋯ on the latest → Redeploy.** Then send a test message from the Contact page and sign up
   in the footer to check.
6. *(When the shop has its own domain)* Resend → **Domains → Add domain**, add the DNS records it shows
   (in Vercel → Domains if the domain is there), then set `CONTACT_FROM_EMAIL`. Emails then come from the
   shop's own address and can be delivered to any inbox.

Contact emails arrive with the customer's address as "reply-to", so hitting **Reply** answers the customer.
Subscribers collected in a Resend audience can be emailed from Resend (**Broadcasts**) or exported as CSV.

Both forms include a hidden spam trap, so most bots are ignored automatically.

## 7. Visitor analytics (Vercel Web Analytics)

The code is already in the site. To switch it on: **Vercel → your project → Analytics → Enable**.
Visitor numbers, top pages, referrers and devices appear there within a few minutes of real visits.
It doesn't use cookies, so no cookie banner is needed.

---

## 8. Deploy to Vercel

1. Push this project to a GitHub repository. If it lives in a subfolder (like `daymark/`), that's fine.
2. Go to https://vercel.com/new and import the repository.
3. If the project is in a subfolder, set **Root Directory** to `daymark`. Vercel detects Next.js automatically.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: your live address, e.g. `https://daymark.ca` (used for SEO and social previews)
   - `STRIPE_SECRET_KEY`: when you're ready for payments
5. Click **Deploy**. Every later push to GitHub redeploys automatically.
6. To use your own domain: Project → Settings → Domains.

---

## What's where

```
daymark/
├─ app/                        Pages (one folder per URL)
│  ├─ page.tsx                 Home
│  ├─ collections/[...slug]/   Every collection: /collections/clothing, /collections/clothing/mens/t-shirts, /collections/sale…
│  ├─ products/[slug]/         Product pages
│  ├─ cart/  checkout/         Full cart page and checkout (+ /checkout/success)
│  ├─ search/                  Search results page
│  ├─ about/ contact/ faq/ shipping/ returns/ privacy/ terms/ account/
│  ├─ api/                     checkout (Stripe), newsletter, contact
│  ├─ not-found.tsx            404 page
│  ├─ sitemap.ts  robots.ts    SEO
│  └─ globals.css              Brand colours and shared styles
├─ components/                 Header, MegaMenu, MobileDrawer, CartDrawer, SearchOverlay, Footer,
│                              ProductCard, ProductCarousel, ProductGallery, CollectionView (filters + sort)…
├─ data/                       products.ts, navigation.ts, site.ts, images.ts   ← the files you'll edit most
├─ lib/                        Cart (saved in the browser), search, collections, prices, SEO helpers
├─ public/images/              All photos (placeholders for now)
├─ scripts/images.mts          Generates IMAGES.md and placeholders
└─ IMAGES.md                   Photo checklist for the client
```

### Features at a glance

- Rotating announcement bar; sticky header with mega menus (desktop) and a slide-in drawer with nested menus (mobile)
- Live search overlay plus a full search results page
- Collection pages with filters (category, price, colour/shade, size) and sorting (featured, newest, price)
- Product pages: swipeable gallery with thumbnails, colour/shade/size pickers, quantity, tabs, "You may also like"
- Cart drawer and full cart page, saved in the browser (localStorage), with a free-shipping progress bar
- Keyboard accessible (skip link, focus rings, Escape closes menus), alt text, reduced-motion support
- Page titles, descriptions, Open Graph/Twitter tags, product and FAQ structured data, sitemap

> The policy pages (Privacy, Terms, Shipping, Returns) are sensible starting templates, not legal advice.
> Have them reviewed before launch.
