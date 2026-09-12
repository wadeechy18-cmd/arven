"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";
import type { OrderStatus } from "@/lib/supabase/types";

async function assertAdmin() {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

const variantSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  swatchHex: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  priceDelta: z.coerce.number().int().default(0),
});

const productSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  material: z.string().min(1),
  dimensions: z.string().optional(),
  careInstructions: z.string().optional(),
  origin: z.string().optional(),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).optional(),
  sku: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  featured: z.coerce.boolean().default(false),
  isBestSeller: z.coerce.boolean().default(false),
  isNewArrival: z.coerce.boolean().default(false),
  imageUrls: z.array(z.string().min(1)).min(1),
  variants: z.array(variantSchema).default([]),
});

export type ProductFormInput = z.infer<typeof productSchema>;

export async function createProduct(input: ProductFormInput) {
  await assertAdmin();
  const data = productSchema.parse(input);
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug: slugify(data.name),
      category_id: data.categoryId,
      short_description: data.shortDescription,
      description: data.description,
      material: data.material,
      dimensions: data.dimensions,
      care_instructions: data.careInstructions,
      origin: data.origin,
      price: data.price,
      compare_at_price: data.compareAtPrice || null,
      sku: data.sku,
      stock_quantity: data.stock,
      featured: data.featured,
      is_best_seller: data.isBestSeller,
      is_new_arrival: data.isNewArrival,
    })
    .select("id")
    .single();

  if (error || !product) throw new Error(error?.message ?? "Failed to create product.");

  await writeImagesAndVariants(product.id, data);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { id: product.id as string };
}

export async function updateProduct(id: string, input: ProductFormInput) {
  await assertAdmin();
  const data = productSchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      category_id: data.categoryId,
      short_description: data.shortDescription,
      description: data.description,
      material: data.material,
      dimensions: data.dimensions,
      care_instructions: data.careInstructions,
      origin: data.origin,
      price: data.price,
      compare_at_price: data.compareAtPrice || null,
      sku: data.sku,
      stock_quantity: data.stock,
      featured: data.featured,
      is_best_seller: data.isBestSeller,
      is_new_arrival: data.isNewArrival,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("product_images").delete().eq("product_id", id);
  await supabase.from("product_variants").delete().eq("product_id", id);
  await writeImagesAndVariants(id, data);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
}

async function writeImagesAndVariants(productId: string, data: ProductFormInput) {
  const supabase = await createClient();

  const { error: imgError } = await supabase.from("product_images").insert(
    data.imageUrls.map((url, i) => ({
      product_id: productId,
      image_url: url,
      alt_text: data.name,
      sort_order: i,
    })),
  );
  if (imgError) throw new Error(imgError.message);

  if (data.variants.length > 0) {
    const { error: variantError } = await supabase.from("product_variants").insert(
      data.variants.map((v, i) => ({
        product_id: productId,
        name: v.name,
        value: v.value,
        swatch_hex: v.swatchHex,
        stock_quantity: v.stock,
        price_delta: v.priceDelta,
        sku: `${data.sku}-${i + 1}`,
      })),
    );
    if (variantError) throw new Error(variantError.message);
  }
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  heroImage: z.string().optional(),
});

export async function createCategory(input: z.infer<typeof categorySchema>) {
  await assertAdmin();
  const data = categorySchema.parse(input);
  const supabase = await createClient();

  const { error } = await supabase.from("categories").insert({
    name: data.name,
    slug: slugify(data.name),
    description: data.description,
    image_url: data.heroImage,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deleteCategory(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", orderId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
