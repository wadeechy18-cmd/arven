/**
 * Demo mode: the whole app runs on static, hardcoded data (src/lib/demo-data.ts)
 * and skips Supabase entirely — no live database, no real auth, no
 * persisted orders. This lets the site deploy and work with zero
 * configuration, for showing the design/UX before the Supabase project is
 * fully wired up.
 *
 * To go live on Supabase: flip this to `false`, run
 * supabase/migrations/0001_init.sql against your project, and set
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY /
 * SUPABASE_SERVICE_ROLE_KEY in your environment (see README.md). Every
 * file that branches on this flag keeps its original Supabase-backed code
 * path right next to the demo one.
 */
export const DEMO_MODE = true;
