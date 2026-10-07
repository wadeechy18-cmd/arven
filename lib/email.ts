/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EMAIL (Resend): used by the contact form and newsletter sign-up.
 *
 *  Setup (free, ~10 minutes). Full steps in README → "Email: contact form & newsletter".
 *   1. Sign up at https://resend.com using the inbox that should receive messages.
 *   2. API Keys → Create API key (permission: Full access) → copy it.
 *   3. In Vercel → Settings → Environment Variables add:
 *        RESEND_API_KEY        the key from step 2                         (required)
 *        CONTACT_TO_EMAIL      where messages go (defaults to site.email)  (optional)
 *        CONTACT_FROM_EMAIL    e.g. "Daymark <hello@daymark.ca>"           (optional, needs a verified domain)
 *        RESEND_AUDIENCE_ID    Audiences → copy ID, to collect subscribers (optional)
 *   4. Redeploy.
 *
 *  Without a verified domain, Resend only delivers to the email address the
 *  Resend account was created with. So sign up with the shop's inbox.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { site } from "@/data/site";

const API = "https://api.resend.com";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function headers() {
  return {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };
}

/** Sends a plain-text email to the shop's inbox. Throws if Resend rejects it. */
export async function sendToShop({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }) {
  const res = await fetch(`${API}/emails`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      // onboarding@resend.dev works before a domain is verified.
      from: process.env.CONTACT_FROM_EMAIL || `${site.name} website <onboarding@resend.dev>`,
      to: [process.env.CONTACT_TO_EMAIL || site.email],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend email failed (${res.status}): ${detail}`);
  }
}

/**
 * Adds a newsletter subscriber. With RESEND_AUDIENCE_ID set, the address is
 * saved to that Resend audience (export it or send broadcasts from Resend).
 * Without it, the shop just gets an email for each new subscriber.
 */
export async function addSubscriber(email: string) {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    await sendToShop({ subject: `New newsletter subscriber: ${email}`, text: `${email} joined the Daymark list on the website.` });
    return;
  }
  const res = await fetch(`${API}/audiences/${encodeURIComponent(audienceId)}/contacts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (!res.ok) {
    const detail = await res.text();
    // Signing up twice isn't an error for the visitor.
    if (/already exists/i.test(detail)) return;
    throw new Error(`Resend audience failed (${res.status}): ${detail}`);
  }
}
