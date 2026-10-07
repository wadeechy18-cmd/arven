/**
 * Contact form endpoint (used by /contact). Emails each message to the shop
 * via Formspree or Resend. Setup: see lib/email.ts or README → "Email: contact form & newsletter".
 */
import { site } from "@/data/site";
import { emailConfigured, sendContactMessage } from "@/lib/email";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const topic = String(data.topic ?? "General").trim().slice(0, 100);
  const order = String(data.order ?? "").trim().slice(0, 100);
  const message = String(data.message ?? "").trim();

  // Hidden "website" field: people never fill it in, spam bots do.
  if (String(data.website ?? "")) return Response.json({ message: "Thanks! We'll be in touch soon." });

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 5) {
    return Response.json({ message: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }
  if (name.length > 200 || email.length > 254 || message.length > 5000) {
    return Response.json({ message: "That message is a little long. Please shorten it." }, { status: 400 });
  }

  if (!emailConfigured()) {
    return Response.json(
      { message: `Our contact form isn't connected yet. Please email us directly at ${site.email}.` },
      { status: 503 },
    );
  }

  try {
    await sendContactMessage({ name, email, topic, order, message });
  } catch (err) {
    console.error("[contact]", err);
    return Response.json(
      { message: `Sorry, your message couldn't be sent. Please email us at ${site.email}.` },
      { status: 502 },
    );
  }

  return Response.json({ message: `Thanks, ${name.split(" ")[0]}! We'll reply within 1–2 business days.` });
}
