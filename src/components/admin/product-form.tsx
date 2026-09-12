"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/ui/image";
import type { CategoryView } from "@/lib/data";

import { createProduct, updateProduct, deleteProduct, type ProductFormInput } from "@/lib/admin-actions";
import type { ProductWithRelations } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

const PLACEHOLDER_IMAGES = [
  "/placeholders/texture-jute-01.svg",
  "/placeholders/texture-jute-02.svg",
  "/placeholders/texture-jute-03.svg",
  "/placeholders/texture-leather-01.svg",
  "/placeholders/texture-leather-02.svg",
  "/placeholders/texture-leather-03.svg",
];

interface ProductFormProps {
  categories: CategoryView[];
  product?: ProductWithRelations;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images.map((i) => i.url) ?? [PLACEHOLDER_IMAGES[0]],
  );
  const [variants, setVariants] = useState(
    product?.variants.map((v) => ({
      name: v.name,
      value: v.value,
      swatchHex: v.swatchHex ?? "",
      stock: v.stock,
      priceDelta: v.priceDelta,
    })) ?? [],
  );

  function addImage(url: string) {
    setImageUrls((prev) => [...prev, url]);
  }
  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }
  function addVariant() {
    setVariants((prev) => [...prev, { name: "Colour", value: "", swatchHex: "#4A3626", stock: 0, priceDelta: 0 }]);
  }
  function updateVariant(index: number, patch: Partial<(typeof variants)[number]>) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }
  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    const input: ProductFormInput = {
      name: String(form.get("name")),
      categoryId: String(form.get("categoryId")),
      shortDescription: String(form.get("shortDescription")),
      description: String(form.get("description")),
      material: String(form.get("material")),
      dimensions: String(form.get("dimensions") ?? "") || undefined,
      careInstructions: String(form.get("careInstructions") ?? "") || undefined,
      origin: String(form.get("origin") ?? "") || undefined,
      price: Math.round(Number(form.get("price")) * 100),
      compareAtPrice: form.get("compareAtPrice")
        ? Math.round(Number(form.get("compareAtPrice")) * 100)
        : undefined,
      sku: String(form.get("sku")),
      stock: Number(form.get("stock")),
      featured: form.get("featured") === "on",
      isBestSeller: form.get("isBestSeller") === "on",
      isNewArrival: form.get("isNewArrival") === "on",
      imageUrls,
      variants: variants.map((v) => ({
        name: v.name,
        value: v.value,
        swatchHex: v.swatchHex || undefined,
        stock: v.stock,
        priceDelta: v.priceDelta,
      })),
    };

    startTransition(async () => {
      try {
        if (product) {
          await updateProduct(product.id, input);
          router.push("/admin/products");
        } else {
          const created = await createProduct(input);
          router.push(`/admin/products/${created.id}`);
        }
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProduct(product.id);
      router.push("/admin/products");
      router.refresh();
    });
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none";
  const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="grid gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Product Name</label>
          <input name="name" required defaultValue={product?.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select name="categoryId" required defaultValue={product?.categoryId} className={inputClass}>
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>SKU</label>
          <input name="sku" required defaultValue={product?.sku} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Short Description</label>
          <input name="shortDescription" required defaultValue={product?.shortDescription} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Full Description</label>
          <textarea name="description" required rows={4} defaultValue={product?.description} className={inputClass} />
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Price (USD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={product ? (product.price / 100).toFixed(2) : undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Compare-at Price (optional)</label>
          <input
            name="compareAtPrice"
            type="number"
            step="0.01"
            defaultValue={product?.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Base Stock</label>
          <input name="stock" type="number" required defaultValue={product?.stock ?? 0} className={inputClass} />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" name="featured" id="featured" defaultChecked={product?.featured} />
          <label htmlFor="featured" className="text-sm">Featured</label>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" name="isBestSeller" id="isBestSeller" defaultChecked={product?.isBestSeller} />
          <label htmlFor="isBestSeller" className="text-sm">Best Seller</label>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" name="isNewArrival" id="isNewArrival" defaultChecked={product?.isNewArrival} />
          <label htmlFor="isNewArrival" className="text-sm">New Arrival</label>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Material</label>
          <input name="material" required defaultValue={product?.material} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Dimensions</label>
          <input name="dimensions" defaultValue={product?.dimensions ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Care Instructions</label>
          <input name="careInstructions" defaultValue={product?.careInstructions ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Origin</label>
          <input name="origin" defaultValue={product?.origin ?? ""} className={inputClass} />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <label className={labelClass}>Product Images</label>
        <div className="mb-3 flex flex-wrap gap-3">
          {imageUrls.map((url, i) => (
            <div key={url + i} className="relative h-20 w-20 overflow-hidden rounded border border-gray-200">
              <Image src={url} alt="" fill className="object-cover" sizes="80px" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="mb-2 text-xs text-gray-500">
          Upload real product photography, paste an image URL, or pick a placeholder texture for now.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <ImageUpload onAdd={addImage} />
          {PLACEHOLDER_IMAGES.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => addImage(url)}
              className="relative h-10 w-10 overflow-hidden rounded border border-gray-200 hover:ring-2 hover:ring-gray-400"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="40px" />
            </button>
          ))}
          <ImageUrlInput onAdd={addImage} inputClass={inputClass} />
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <label className={labelClass}>Variants (colour/size options)</label>
          <button type="button" onClick={addVariant} className="text-xs font-medium text-gray-700 underline">
            + Add Variant
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-5 items-center gap-2">
              <input
                placeholder="Group (Colour)"
                value={v.name}
                onChange={(e) => updateVariant(i, { name: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Value (Espresso)"
                value={v.value}
                onChange={(e) => updateVariant(i, { value: e.target.value })}
                className={inputClass}
              />
              <input
                type="color"
                value={v.swatchHex || "#4A3626"}
                onChange={(e) => updateVariant(i, { swatchHex: e.target.value })}
                className="h-9 w-full rounded border border-gray-300"
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                className={inputClass}
              />
              <button type="button" onClick={() => removeVariant(i)} className="text-xs text-red-600">
                Remove
              </button>
            </div>
          ))}
          {variants.length === 0 && <p className="text-sm text-gray-500">No variants — single option product.</p>}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
        {product && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}

function ImageUpload({ onAdd }: { onAdd: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    onAdd(data.publicUrl);
  }

  return (
    <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
      {uploading ? "Uploading…" : "Upload Photo"}
      <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
      {error && <span className="ml-2 text-red-600">{error}</span>}
    </label>
  );
}

function ImageUrlInput({ onAdd, inputClass }: { onAdd: (url: string) => void; inputClass: string }) {
  const [value, setValue] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        placeholder="https://…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`${inputClass} h-10 w-48`}
      />
      <button
        type="button"
        onClick={() => {
          if (!value.trim()) return;
          onAdd(value.trim());
          setValue("");
        }}
        className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50"
      >
        Add
      </button>
    </div>
  );
}
