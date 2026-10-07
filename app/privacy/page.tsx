import { TextPage } from "@/components/TextPage";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Daymark collects, uses and protects your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy Policy" updated="October 2026">
      <p>
        {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what personal
        information we collect through this website, how we use it, and your choices. We follow Canada&apos;s Personal
        Information Protection and Electronic Documents Act (PIPEDA).
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Order details:</strong> name, email, shipping address and phone number, collected at checkout to
          fulfil your order.
        </li>
        <li>
          <strong>Payment details:</strong> processed securely by our payment provider, Stripe. We never see or store
          your full card number.
        </li>
        <li>
          <strong>Messages and sign-ups:</strong> what you send through our contact form or newsletter sign-up.
        </li>
        <li>
          <strong>Browsing data:</strong> your cart is saved in your own browser (local storage) so it&apos;s still
          there when you come back. We may use basic, privacy-friendly analytics to understand which pages are popular.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process, ship and support your orders.</li>
        <li>To reply to your questions.</li>
        <li>To send marketing emails, only if you&apos;ve signed up. You can unsubscribe at any time.</li>
        <li>To improve our website and products.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We share only what&apos;s needed with service providers who help us run the shop, such as our payment
        processor, shipping carriers, email provider and website host. Some of these providers may store data outside
        Canada. We never sell your personal information.
      </p>

      <h2>How long we keep it</h2>
      <p>We keep order records as long as required for tax and accounting purposes, and other data only as long as needed.</p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete the personal information we hold about you, or withdraw your consent to
        marketing, by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Contact us at <a href={`mailto:${site.email}`}>{site.email}</a>, {site.location}.
      </p>
    </TextPage>
  );
}
