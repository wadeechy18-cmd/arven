# Arven

A premium, minimal e-commerce site for jute bags, leather wallets, and other
natural-material accessories. Next.js (App Router) + TypeScript + Tailwind
CSS on the frontend, Supabase (PostgreSQL + Auth + Storage, with Row Level
Security) as the backend.

## Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase — PostgreSQL, Auth, Storage
- **Data access:** `@supabase/supabase-js` + `@supabase/ssr`, protected by
  Row Level Security policies (see `supabase/migrations/0001_init.sql`)
- **State:** Zustand (cart, persisted to localStorage)

## Getting started

### 1. Create a Supabase project

Create a free project at [supabase.com](https://supabase.com). From
**Settings → API**, copy:

- Project URL
- `anon` `public` key
- `service_role` key (**secret** — server-only)

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` from step 1. Never commit `.env` or put the
service-role key behind `NEXT_PUBLIC_`.

### 3. Run the database migration

Open your project's **SQL Editor** in the Supabase dashboard, paste the
contents of `supabase/migrations/0001_init.sql`, and run it. (Or, if you
have the Supabase CLI linked to this project: `supabase db push`.)

This creates every table, index, RLS policy, the `create_order()` function
that safely places orders, and the `product-images` Storage bucket.

### 4. Install dependencies and seed demo data

```bash
npm install
npm run db:seed   # optional — loads demo jute/leather products
```

The seed script uses the service-role key and is dev/demo-only; it never
runs automatically and is safe to skip in production.

### 5. Create your admin account

1. `npm run dev`, then sign up at `/register` with your own email.
2. In the Supabase SQL Editor, promote that account:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Sign in and visit `/admin`.

### 6. Run the app

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## Testing

```bash
npm run typecheck
npm run build
```

## Project layout

```
src/app/(site)/    Storefront pages (home, shop, product, cart, checkout, account, ...)
src/app/admin/      Admin dashboard (separate root layout, no storefront chrome)
src/app/api/        Route handlers (orders, contact, newsletter)
src/components/      UI components, grouped by feature
src/lib/supabase/    Browser/server/admin Supabase clients + SSR middleware helper
src/lib/data.ts       Read-side data access (products, categories)
src/lib/admin-actions.ts  Server Actions for admin CRUD
supabase/migrations/  SQL schema, RLS policies, create_order() function
scripts/seed.ts        Dev-only demo data loader
```

## Security notes

- Every table has Row Level Security enabled. Public read access is scoped
  to active products/categories; writes require `profiles.role = 'admin'`.
- Order creation goes through a single `create_order()` Postgres function
  (`SECURITY DEFINER`) that re-fetches prices and locks stock rows itself —
  the browser's cart total is never trusted for the charge amount.
- The service-role key is only ever read in `src/lib/supabase/admin.ts`
  (guarded by the `server-only` package) and `scripts/seed.ts`. It is never
  sent to the client.
- Admin routes are protected in `src/middleware.ts` (redirects unauthenticated
  users) **and** by RLS policies at the database layer — the frontend check
  alone is never the only gate.

## Payments

No payment provider is wired in yet. Checkout supports "Pay on Delivery"
today; the "Card" option is a placeholder. `orders.payment_status` and
`orders.order_status` are ready for a webhook-driven integration (e.g.
Stripe): a payment provider's webhook should be the only thing that flips
`payment_status` to `paid` — never the client-side checkout response.
