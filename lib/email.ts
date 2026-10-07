/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FORMS → EMAIL: used by the contact form and newsletter sign-up.
 *
 *  Pick ONE of these. Full steps in README → "Email: contact form & newsletter".
 *
 *  Option A: Formspree (simplest, no API key)
 *    1. Sign up at https://formspree.io with the inbox that should receive messages.
 *    2. + New form → copy the form ID (the part after /f/ in https://formspree.io/f/abcdwxyz).
 *    3. In Vercel → Settings → Environment Variables add:
 *         FORMSPREE_FORM_ID   e.g. abcdwxyz
 *    4. Redeploy.
 *
 *  Option B: Resend (more control: custom sender, subscriber audiences, broadcasts)
 *    1. Sign up at https://resend.com using the inbox that should receive messages.
 *    2. API Keys → Create API key (permission: Full access) → copy it.
 *    3. In Vercel → Settings → Environment Variables add:
 *         RESEND_API_KEY        the key from step 2                         (required)
 *         CONTACT_TO_EMAIL      where messages go (defaults to site.email)  (optional)
 *         CONTACT_FROM_EMAIL    e.g. "Daymark <hello@daymark.ca>"           (optional, needs a verified domain)
 *         RESEND_AUDIENCE_ID    Audiences → copy ID, to collect subscribers (optional)
 *    4. Redeploy.
 *    Without a verified domain, Resend only delivers to the email address the
 *    Resend account was created with. So sign up with the shop's inbox.
 *
 *  If both are set, Formspree is used.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { site } from "@/data/site";

const RESEND_API = "https://api.resend.com";

type Provider = "formspree" | "resend";

function provider(): Provider | null {
  if (process.env.FORMSPREE_FORM_ID?.trim()) return "formspree";
  if (process.env.RESEND_API_KEY?.trim()) return "resend";
  return null;
}

export function emailConfigured(): boolean {
  return provider() !== null;
}

export interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  order: string;
  message: string;
}

/** Sends a contact-form message to the shop's inbox. Throws if the provider rejects it. */
export async function sendContactMessage(m: ContactMessage) {
  const subject = `Website enquiry: ${m.topic}${m.order ? ` (order ${m.order})` : ""}`;
  if (provider() === "formspree") {
    await postToFormspree({
      _subject: subject,
      name: m.name,
      email: m.email, // Formspree uses this as the reply-to address
      topic: m.topic,
      order: m.order || "-",
      message: m.message,
    });
    return;
  }
  await sendWithResend({
    subject,
    replyTo: m.email,
    text: [
      `Name: ${m.name}`,
      `Email: ${m.email}`,
      `Topic: ${m.topic}`,
      `Order number: ${m.order || "-"}`,
      "",
      m.message,
      "",
      "Reply to this email to answer the customer directly.",
    ].join("\n"),
  });
}

/**
 * Records a newsletter subscriber.
 * Formspree: appears as a submission (Formspree can export them as CSV).
 * Resend: saved to RESEND_AUDIENCE_ID if set, otherwise the shop gets an email.
 */
export async function addSubscriber(email: string) {
  if (provider() === "formspree") {
    await postToFormspree({ _subject: `New newsletter subscriber: ${email}`, email, type: "Newsletter sign-up" });
    return;
  }
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!audienceId) {
    await sendWithResend({ subject: `New newsletter subscriber: ${email}`, text: `${email} joined the Daymark list on the website.` });
    return;
  }
  const res = await fetch(`${RESEND_API}/audiences/${encodeURIComponent(audienceId)}/contacts`, {
    method: "POST",
    headers: resendHeaders(),
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (!res.ok) {
    const detail = await res.text();
    // Signing up twice isn't an error for the visitor.
    if (/already exists/i.test(detail)) return;
    throw new Error(`Resend audience failed (${res.status}): ${detail}`);
  }
}

// ── Formspree ──

async function postToFormspree(fields: Record<string, string>) {
  const id = process.env.FORMSPREE_FORM_ID!.trim().replace(/^.*\/f\//, ""); // accept the ID or the full URL
  const res = await fetch(`https://formspree.io/f/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", Referer: site.url },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Formspree failed (${res.status}): ${detail}`);
  }
}

// ── Resend ──

function resendHeaders() {
  return {
    Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`,
    "Content-Type": "application/json",
  };
}

async function sendWithResend({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }) {
  const res = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: resendHeaders(),
    body: JSON.stringify({
      // onboarding@resend.dev works before a domain is verified.
      from: process.env.CONTACT_FROM_EMAIL?.trim() || `${site.name} website <onboarding@resend.dev>`,
      to: [process.env.CONTACT_TO_EMAIL?.trim() || site.email],
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
