import { createClient } from "@/lib/supabase/server";
import { DEMO_MODE } from "@/lib/demo-mode";
import type { Profile } from "@/lib/supabase/types";

/** The signed-in user's profile (role, name, phone), or null if signed out. */
export async function getCurrentUser(): Promise<Profile | null> {
  if (DEMO_MODE) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return profile ?? null;
}

/** Same as getCurrentUser(), but returns null unless the user is an admin. */
export async function requireAdmin(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
