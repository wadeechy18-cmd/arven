import Link from "next/link";
import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms that apply when you use the Daymark website and buy from us.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <TextPage title="Terms of Use" updated="October 2026">
      <p>
        These terms apply to your use of this website and any purchase you make from {site.name}, based in{" "}
        {site.location}. By using the site or placing an order, you agree to them.
      </p>

      <h2>Products and prices</h2>
      <p>
        All prices are in Canadian dollars ({site.currency}) and exclude applicable taxes, which are added at checkout.
        We work hard to show products accurately, but colours can look slightly different on different screens. Natural
        materials like jute and linen vary slightly from piece to piece; that&apos;s part of their character.
      </p>
      <p>
        We may change prices or discontinue products at any time. If an obvious pricing error occurs, we may cancel the
        affected order and refund you in full.
      </p>

      <h2>Orders</h2>
      <p>
        Your order is an offer to buy. We accept it when we ship it and send a shipping confirmation. We may refuse or
        cancel an order, for example if an item is out of stock, in which case you&apos;ll receive a full refund.
      </p>

      <h2>Shipping and returns</h2>
      <p>
        Please see our <Link href="/shipping">Shipping policy</Link> and{" "}
        <Link href="/returns">Returns &amp; exchanges</Link> pages.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this site, including text, photos, logos and designs, belongs to {site.name} or its licensors
        and may not be copied or used without permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, {site.name} isn&apos;t liable for indirect or consequential losses arising from
        your use of this site or our products. Nothing in these terms limits your rights under Canadian consumer
        protection law.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there.</p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </TextPage>
  );
}
