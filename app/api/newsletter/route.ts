/**
 * Newsletter sign-up endpoint (used by the footer form). Saves subscribers to a
 * Resend audience, or emails the shop about each one. Setup: see lib/email.ts
 * or README → "Email: contact form & newsletter".
 */
import { addSubscriber, emailConfigured } from "@/lib/email";

export async function POST(request: Request) {
  let body: { email?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }
  const email = String(body.email ?? "").trim().toLowerCase();

  // Hidden "website" field: people never fill it in, spam bots do.
  if (String(body.website ?? "")) return Response.json({ message: "You're on the list!" });

  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (!emailConfigured()) {
    return Response.json({ message: "Newsletter sign-up opens soon. Please check back!" }, { status: 503 });
  }

  try {
    await addSubscriber(email);
  } catch (err) {
    console.error("[newsletter]", err);
    return Response.json({ message: "Sorry, we couldn't sign you up just now. Please try again later." }, { status: 502 });
  }

  return Response.json({ message: "You're on the list! Watch your inbox for new arrivals and offers." });
}
