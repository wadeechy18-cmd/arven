import { createClient } from "@/lib/supabase/server";

// App-facing view models. Kept camelCase (and the old field names) on
// purpose: the select() strings below alias every Postgres column back to
// this shape, so page/component code doesn't need to know the DB is now
// Supabase instead of Prisma. Once you run
// `supabase gen types typescript --project-id <id>` against your live
// project, you can tighten these to fully-generated types if you want.

export interface CategoryView {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  position: number;
}

export interface ProductImageView {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface ProductVariantView {
  id: string;
  name: string;
  value: string;
  swatchHex: string | null;
  priceDelta: number;
  stock: number;
  sku: string;
}

export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  material: string;
  dimensions: string | null;
  careInstructions: string | null;
  origin: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  featured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  category: CategoryView;
  images: ProductImageView[];
  variants: ProductVariantView[];
}

const PRODUCT_SELECT = `
  id, name, slug,
  shortDescription:short_description,
  description, material, dimensions,
  careInstructions:care_instructions,
  origin, price,
  compareAtPrice:compare_at_price,
  sku,
  stock:stock_quantity,
  featured,
  isBestSeller:is_best_seller,
  isNewArrival:is_new_arrival,
  rating,
  reviewCount:review_count,
  categoryId:category_id,
  category:categories ( id, name, slug, description, heroImage:image_url, position ),
  images:product_images ( id, url:image_url, alt:alt_text, position:sort_order ),
  variants:product_variants ( id, name, value, swatchHex:swatch_hex, priceDelta:price_delta, stock:stock_quantity, sku )
`;

export async function getCategories(): Promise<CategoryView[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, heroImage:image_url, position")
    .order("position", { ascending: true });

  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return (data ?? []) as unknown as CategoryView[];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryView | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, heroImage:image_url, position")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Failed to load category: ${error.message}`);
  return (data as unknown as CategoryView) ?? null;
}

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
  minPrice?: number;
  maxPrice?: number;
  bestSellersOnly?: boolean;
  newArrivalsOnly?: boolean;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const hasCategoryFilter = !!filters.categorySlug && filters.categorySlug !== "all";
  // !inner turns the embed into an inner join so the category filter applies.
  const select = hasCategoryFilter
    ? PRODUCT_SELECT.replace("category:categories (", "category:categories!inner (")
    : PRODUCT_SELECT;

  // Typed as `any` deliberately: the aliased select string above produces a
  // camelCase shape PostgREST's generic inference can't express, and every
  // caller already casts the final result to ProductWithRelations[] anyway.
  let query: any = supabase.from("products").select(select).eq("is_active", true);

  if (hasCategoryFilter) {
    query = query.eq("category.slug", filters.categorySlug);
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,material.ilike.%${filters.search}%`,
    );
  }
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.bestSellersOnly) query = query.eq("is_best_seller", true);
  if (filters.newArrivalsOnly) query = query.eq("is_new_arrival", true);

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "featured":
    default:
      query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return (data as unknown as ProductWithRelations) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("featured", true)
    .limit(limit);

  if (error) throw new Error(`Failed to load featured products: ${error.message}`);
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getBestSellers(limit = 8): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_best_seller", true)
    .limit(limit);

  if (error) throw new Error(`Failed to load best sellers: ${error.message}`);
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return (data as unknown as ProductWithRelations) ?? null;
}

/** Admin listing: includes inactive products too (admin-only RLS policy covers this). */
export async function getAllProductsForAdmin(): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getRelatedProducts(
  product: ProductWithRelations,
  limit = 4,
): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("category_id", product.categoryId)
    .neq("id", product.id)
    .limit(limit);

  if (error) throw new Error(`Failed to load related products: ${error.message}`);
  return (data ?? []) as unknown as ProductWithRelations[];
}
