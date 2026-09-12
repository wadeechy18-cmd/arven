// Hand-maintained app-level enums used across the codebase. The Supabase
// clients are intentionally left untyped (no generic `Database` type) here
// rather than hand-rolling one: PostgREST's generic inference needs an
// exact, fully-structured schema (Row/Insert/Update/Relationships per
// table) to be useful, and a partial hand-written one does more harm than
// good (silently infers `never` in places). Run
// `supabase gen types typescript --project-id <id>` against your live
// project and wire the result in here if you want full query type-safety.

export type Role = "customer" | "admin";
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "cod" | "card";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}
