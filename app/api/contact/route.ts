/**
 * Contact form endpoint (used by /contact).
 *
 * TODO(contact): send the message to the shop's inbox. Easiest option, Resend (free tier):
 *   1. Sign up at https://resend.com, verify your domain, create an API key.
 *   2. Add RESEND_API_KEY as an environment variable.
 *   3. Replace the "pretend success" block below with:
 *        await fetch("https://api.resend.com/emails", {
 *          method: "POST",
 *          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
 *          body: JSON.stringify({
 *            from: "Daymark website <hello@yourdomain.ca>",
 *            to: site.email,
 *            reply_to: email,
 *            subject: `Website enquiry: ${topic}`,
 *            text: `${name} <${email}>\nOrder: ${order || "-"}\n\n${message}`,
 *          }),
 *        });
 *   Formspree, EmailJS or SendGrid can be used the same way.
 */
import { site } from "@/data/site";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const topic = String(data.topic ?? "General").trim();
  const order = String(data.order ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 5) {
    return Response.json({ message: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }
  if (name.length > 200 || message.length > 5000) {
    return Response.json({ message: "That message is a little long. Please shorten it." }, { status: 400 });
  }

  // ── Pretend success until an email service is connected ──
  console.info("[contact] message (not yet emailed to %s):", site.email, { name, email, topic, order });

  return Response.json({ message: `Thanks, ${name.split(" ")[0]}! We'll reply within 1–2 business days.` });
}
