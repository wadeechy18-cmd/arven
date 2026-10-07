import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { images } from "@/data/images";
import { site } from "@/data/site";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

// Brand typeface. To change it, swap DM_Sans for another Google font here.
const brandFont = DM_Sans({ subsets: ["latin"], variable: "--font-brand", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    siteName: site.name,
    locale: "en_CA",
    type: "website",
    images: [{ url: images.ogDefault.src, width: images.ogDefault.width, height: images.ogDefault.height, alt: images.ogDefault.alt }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={brandFont.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-canvas"
        >
          Skip to content
        </a>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
