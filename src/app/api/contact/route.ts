import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { DEMO_MODE } from "@/lib/demo-mode";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().min(1).max(150),
  message: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  if (DEMO_MODE) return NextResponse.json({ ok: true });

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
