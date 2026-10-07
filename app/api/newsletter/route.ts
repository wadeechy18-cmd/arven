/**
 * Newsletter sign-up endpoint (used by the footer form).
 *
 * TODO(newsletter): connect a mailing-list provider. For example, with Mailchimp:
 *   1. Mailchimp → Audience → Settings → copy the Audience ID.
 *   2. Account → Extras → API keys → create a key.
 *   3. Add MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID as environment variables.
 *   4. Replace the "pretend success" block below with:
 *        const dc = process.env.MAILCHIMP_API_KEY!.split("-")[1];
 *        await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`, {
 *          method: "POST",
 *          headers: { Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}` },
 *          body: JSON.stringify({ email_address: email, status: "subscribed" }),
 *        });
 *   Klaviyo, ConvertKit (Kit) and Shopify Email work the same way.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    ({ email } = (await request.json()) as { email: string });
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  // ── Pretend success until a provider is connected ──
  console.info("[newsletter] sign-up (not yet sent to a provider):", email);

  return Response.json({ message: "You're on the list! Check your inbox for 10% off." });
}
