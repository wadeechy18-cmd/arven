-- Arven e-commerce schema for Supabase (PostgreSQL + Auth + Storage + RLS)
-- Run this once in the Supabase SQL Editor (or via `supabase db push`) on a
-- fresh project. Safe to re-run: guarded with IF NOT EXISTS / OR REPLACE
-- wherever practical, but it is written as a single forward migration.

create extension if not exists "pgcrypto";

-- =========================================================================
-- 1. PROFILES  (auth-linked customer + role record)
-- =========================================================================
-- One row per auth.users row. Holds the customer contact fields the brief
-- asks for (name/email/phone) plus the role used everywhere for
-- authorization. Consolidating "customers" into "profiles" avoids a
-- duplicate, driftable copy of the user's email/name.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_idx on public.profiles (email);

-- =========================================================================
-- 2. CATEGORIES
-- =========================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- 3. PRODUCTS
-- =========================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  short_description text not null default '',
  material text not null default '',
  dimensions text,
  care_instructions text,
  origin text,
  price integer not null check (price >= 0),                 -- cents
  compare_at_price integer check (compare_at_price >= 0),     -- cents
  category_id uuid not null references public.categories (id) on delete restrict,
  sku text not null unique,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  rating numeric(2, 1) not null default 4.8,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_sku_idx on public.products (sku);

-- =========================================================================
-- 4. PRODUCT IMAGES
-- =========================================================================
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

-- =========================================================================
-- 5. PRODUCT VARIANTS  (colour/size options)
-- =========================================================================
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,             -- e.g. "Colour"
  value text not null,            -- e.g. "Espresso"
  swatch_hex text,
  price_delta integer not null default 0,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  sku text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists product_variants_product_id_idx on public.product_variants (product_id);

-- =========================================================================
-- 6. ORDERS
-- =========================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles (id) on delete set null,
  order_number text not null unique,

  email text not null,
  phone text not null,

  subtotal integer not null check (subtotal >= 0),
  shipping_cost integer not null default 0 check (shipping_cost >= 0),
  discount integer not null default 0 check (discount >= 0),
  total integer not null check (total >= 0),
  currency text not null default 'USD',

  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'pending'
    check (order_status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_method text not null default 'cod' check (payment_method in ('cod', 'card')),

  shipping_name text not null,
  shipping_address text not null,
  shipping_address_2 text,
  shipping_city text not null,
  shipping_state text,
  shipping_postcode text not null,
  shipping_country text not null,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists orders_order_number_idx on public.orders (order_number);
create index if not exists orders_customer_id_idx on public.orders (customer_id);

-- =========================================================================
-- 7. ORDER ITEMS
-- =========================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  variant_label text,
  image_url text,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  total_price integer not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- =========================================================================
-- 8. NEWSLETTER + CONTACT (low-risk public forms)
-- =========================================================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- 9. updated_at triggers
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.categories;
create trigger set_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.products;
create trigger set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.orders;
create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 10. New-user hook: auto-create a profile row on signup
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- 11. is_admin() helper — SECURITY DEFINER so it doesn't recurse through
--     profiles' own RLS policy when used inside other policies.
-- =========================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =========================================================================
-- 12. ROW LEVEL SECURITY
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;

-- ---- profiles ------------------------------------------------------------
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- profile rows are created by the handle_new_user trigger (security definer),
-- so no direct client INSERT policy is needed or granted.

-- ---- categories ------------------------------------------------------------
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- products --------------------------------------------------------------
drop policy if exists "products_public_read_active" on public.products;
create policy "products_public_read_active" on public.products
  for select using (is_active = true or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- product_images ---------------------------------------------------------
drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and (p.is_active = true or public.is_admin())
    )
  );

drop policy if exists "product_images_admin_write" on public.product_images;
create policy "product_images_admin_write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- product_variants --------------------------------------------------------
drop policy if exists "product_variants_public_read" on public.product_variants;
create policy "product_variants_public_read" on public.product_variants
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_variants.product_id and (p.is_active = true or public.is_admin())
    )
  );

drop policy if exists "product_variants_admin_write" on public.product_variants;
create policy "product_variants_admin_write" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- orders -----------------------------------------------------------------
-- No direct INSERT policy for anon/authenticated: all order creation goes
-- through the create_order() SECURITY DEFINER function below, which is the
-- only place server-side price/stock validation happens.
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin" on public.orders
  for select using (customer_id = auth.uid() or public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ---- order_items --------------------------------------------------------------
drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or public.is_admin())
    )
  );

-- ---- newsletter / contact -----------------------------------------------------
drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
create policy "newsletter_public_insert" on public.newsletter_subscribers
  for insert with check (true);

drop policy if exists "newsletter_admin_read" on public.newsletter_subscribers;
create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select using (public.is_admin());

drop policy if exists "contact_public_insert" on public.contact_messages;
create policy "contact_public_insert" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_admin_read" on public.contact_messages;
create policy "contact_admin_read" on public.contact_messages
  for select using (public.is_admin());

-- =========================================================================
-- 13. create_order() — the only supported way to place an order.
--     SECURITY DEFINER: runs as the function owner (bypasses RLS on the
--     underlying tables internally) so it can authoritatively re-price the
--     cart, check stock, and write order + order_items atomically. Callable
--     by both anon (guest checkout) and authenticated roles.
-- =========================================================================
create or replace function public.create_order(payload jsonb)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_email text := payload ->> 'email';
  v_phone text := payload ->> 'phone';
  v_payment_method text := coalesce(payload ->> 'paymentMethod', 'cod');
  v_notes text := payload ->> 'notes';
  v_shipping jsonb := payload -> 'shipping';
  v_items jsonb := payload -> 'items';
  v_item jsonb;
  v_product public.products%rowtype;
  v_variant public.product_variants%rowtype;
  v_quantity integer;
  v_unit_price integer;
  v_subtotal integer := 0;
  v_shipping_cost integer;
  v_total integer;
  v_order_id uuid;
  v_order_number text;
  v_free_shipping_threshold constant integer := 10000; -- $100.00 in cents
  v_flat_shipping constant integer := 800;              -- $8.00 in cents
begin
  if v_email is null or v_phone is null or v_shipping is null or v_items is null or jsonb_array_length(v_items) = 0 then
    raise exception 'Missing required order fields' using errcode = '22023';
  end if;

  v_order_number := 'ARV-' || upper(to_hex((extract(epoch from now()) * 1000)::bigint))
    || '-' || upper(substr(md5(random()::text), 1, 4));

  -- Lock the rows we're about to sell so concurrent checkouts can't
  -- oversell the same stock.
  for v_item in select * from jsonb_array_elements(v_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity is null or v_quantity < 1 then
      raise exception 'Invalid quantity' using errcode = '22023';
    end if;

    select * into v_product from public.products
      where id = (v_item ->> 'productId')::uuid
      for update;

    if not found or v_product.is_active = false then
      raise exception 'Product % is not available', coalesce(v_product.name, v_item ->> 'productId')
        using errcode = 'P0002';
    end if;

    if v_item ->> 'variantId' is not null then
      select * into v_variant from public.product_variants
        where id = (v_item ->> 'variantId')::uuid and product_id = v_product.id
        for update;

      if not found then
        raise exception 'Selected option is no longer available' using errcode = 'P0002';
      end if;
      if v_variant.stock_quantity < v_quantity then
        raise exception 'Insufficient stock for %', v_product.name using errcode = 'P0001';
      end if;

      v_unit_price := v_product.price + v_variant.price_delta;

      update public.product_variants
        set stock_quantity = stock_quantity - v_quantity
        where id = v_variant.id;
    else
      if v_product.stock_quantity < v_quantity then
        raise exception 'Insufficient stock for %', v_product.name using errcode = 'P0001';
      end if;

      v_unit_price := v_product.price;

      update public.products
        set stock_quantity = stock_quantity - v_quantity
        where id = v_product.id;
    end if;

    v_subtotal := v_subtotal + (v_unit_price * v_quantity);
  end loop;

  v_shipping_cost := case when v_subtotal >= v_free_shipping_threshold then 0 else v_flat_shipping end;
  v_total := v_subtotal + v_shipping_cost;

  insert into public.orders (
    customer_id, order_number, email, phone,
    subtotal, shipping_cost, total, payment_method,
    payment_status, order_status,
    shipping_name, shipping_address, shipping_address_2,
    shipping_city, shipping_state, shipping_postcode, shipping_country,
    notes
  ) values (
    v_customer_id, v_order_number, v_email, v_phone,
    v_subtotal, v_shipping_cost, v_total, v_payment_method,
    case when v_payment_method = 'card' then 'paid' else 'pending' end,
    case when v_payment_method = 'card' then 'paid' else 'pending' end,
    v_shipping ->> 'fullName', v_shipping ->> 'line1', v_shipping ->> 'line2',
    v_shipping ->> 'city', v_shipping ->> 'state', v_shipping ->> 'postalCode', v_shipping ->> 'country',
    v_notes
  ) returning id into v_order_id;

  -- Second pass to write line items now that we have the order id (kept
  -- separate from the locking loop above for clarity).
  for v_item in select * from jsonb_array_elements(v_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;

    select * into v_product from public.products where id = (v_item ->> 'productId')::uuid;

    if v_item ->> 'variantId' is not null then
      select * into v_variant from public.product_variants where id = (v_item ->> 'variantId')::uuid;
      v_unit_price := v_product.price + v_variant.price_delta;
    else
      v_unit_price := v_product.price;
    end if;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name, variant_label, image_url,
      quantity, unit_price, total_price
    )
    select
      v_order_id, v_product.id,
      case when v_item ->> 'variantId' is not null then (v_item ->> 'variantId')::uuid else null end,
      v_product.name,
      case when v_variant.id is not null then v_variant.name || ': ' || v_variant.value else null end,
      (select pi.image_url from public.product_images pi where pi.product_id = v_product.id order by pi.sort_order asc limit 1),
      v_quantity, v_unit_price, v_unit_price * v_quantity;
  end loop;

  return jsonb_build_object('orderNumber', v_order_number, 'orderId', v_order_id, 'total', v_total);
end;
$$;

-- Allow both anonymous (guest checkout) and authenticated callers to invoke
-- the function; the function body is what enforces every real rule.
grant execute on function public.create_order(jsonb) to anon, authenticated;

-- =========================================================================
-- 14. Storage bucket for product images
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_bucket_public_read" on storage.objects;
create policy "product_images_bucket_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_bucket_admin_write" on storage.objects;
create policy "product_images_bucket_admin_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_bucket_admin_update" on storage.objects;
create policy "product_images_bucket_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_bucket_admin_delete" on storage.objects;
create policy "product_images_bucket_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

-- =========================================================================
-- Done. Next steps (see README):
--   1. Run this file in Supabase SQL Editor (or `supabase db push`).
--   2. Promote your first admin:
--      update public.profiles set role = 'admin' where email = 'you@example.com';
--   3. Set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY /
--      SUPABASE_SERVICE_ROLE_KEY in .env.
--   4. Run `npm run db:seed` to load demo products (dev only).
-- =========================================================================
