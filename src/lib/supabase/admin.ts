import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Service-role client. Bypasses RLS entirely — never import this into a
 * Client Component or anything that ships to the browser (the
 * "server-only" import above makes that a build error, not just a
 * convention). Reserved for trusted server code: the dev seed script and
 * narrow admin operations that have already checked the caller's role.
 */
export function createAdminClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
