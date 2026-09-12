import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-wide section-y max-w-prose !pt-14">
      <p className="eyebrow mb-3">Legal</p>
      <h1 className="mb-8 font-serif text-3xl text-foreground">Privacy Policy</h1>
      <div className="flex flex-col gap-6 leading-relaxed text-muted-foreground">
        <p>
          We collect the information you provide when creating an account, placing
          an order, or contacting us — including your name, email, shipping
          address, and phone number — solely to fulfil orders and respond to
          enquiries.
        </p>
        <p>
          We do not sell your personal information to third parties. Payment
          details are processed by our payment provider and are never stored on
          our servers.
        </p>
        <p>
          You may request access to, correction of, or deletion of your personal
          data at any time by emailing hello@arven.co.
        </p>
      </div>
    </div>
  );
}
